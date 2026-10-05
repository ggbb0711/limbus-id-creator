'use client'
import { canAddTag } from "utils/canAddTag";
import { appConfig } from "config/env.client";
import { useEffect, useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginatedPost, PostSortOption, TagInput, TagList, TagsContainer, useGetPostsQuery } from "features/post";
import "./ForumPage.css"
import DropDown from "components/ui/dropDown/DropDown";
import { useLoginMenu } from "hooks/useLoginMenu";
import useAlert from "hooks/useAlert";
import { useAuth } from "hooks/useAuth";
import getApiErrorMessage from "api/getApiErrorMessage";
import { ForumQueryUpdate, buildForumQuery, parseSort, tagKeyOf } from "features/forum/utils/forumQuery";


export default function ForumPage():ReactElement{
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const tags = searchParams.getAll("tag").map((key) => TagList[key]).filter(Boolean)
    const sortedBy = parseSort(searchParams.get("sort"))
    const currPage = Math.max(0, Number(searchParams.get("page") ?? 0) || 0)
    const urlSearch = searchParams.get("q") ?? ""
    const [searchPostName,setSearchPostName] = useState(urlSearch)

    const {user} = useAuth()
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()

    function updateQuery(next: ForumQueryUpdate) {
        const query = buildForumQuery(searchParams.toString(), next)
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }


    useEffect(() => {
        setSearchPostName(urlSearch)
    }, [urlSearch])


    useEffect(() => {
        if (searchPostName === urlSearch) return
        const timeout = setTimeout(() => updateQuery({ q: searchPostName }), appConfig.timing.searchDebounceMs)
        return () => clearTimeout(timeout)
    }, [searchPostName])

    const { data, isFetching, error } = useGetPostsQuery({
        title: urlSearch,
        tag: tags.map(t => t.tagName),
        sortedBy,
        page: currPage,
        limit: appConfig.paging.postsPerPage,
    })

    const postList = data?.list.map((p) => ({
        ...p,
        cardImg: p.imagesAttach[0]
    })) ?? []
    const maxCount = data?.total ?? 0

    useEffect(() => {
        if (error) addAlert("Failure", getApiErrorMessage(error))
    }, [error])

    const tagKeys = tags.map(tagKeyOf).filter((key): key is string => !!key)

    return <div className="page-container">
        <div className="page-content">
            <div className="forum-input-container">
                <label htmlFor="searchPostName">Post name:</label>
                <input type="text" name="searchPostName" id="searchPostName" className="input" placeholder="Search" value={searchPostName} onChange={(e)=>setSearchPostName(e.target.value)}/>
            </div>
            <div className="forum-input-container">
                <label htmlFor="tag">Tags:</label>
                <TagInput completeFn={(tag)=>{
                    const key = tagKeyOf(tag)
                    if (canAddTag(tagKeys, key, appConfig.limits.post.maxForumFilterTags)) updateQuery({ tag: [...tagKeys, key] })
                }} maxTag={appConfig.limits.post.maxForumFilterTags} selectedCount={tagKeys.length} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            <TagsContainer tags={tags} deleteTag={(i)=>{
                const newTagKeys = [...tagKeys]
                newTagKeys.splice(i,1)
                updateQuery({ tag: newTagKeys })
            }}/>
            <div className="center-element">
                <p>Sorted by: </p>
                <div className="forum-sorted-by">
                    <DropDown<PostSortOption> dropDownEl={{
                        Latest:{
                            el: <div>Latest</div>,
                            value: "Latest"
                        },
                        Earliest:{
                            el: <div>Earliest</div>,
                            value: "Earliest"
                        },
                        MostViewed:{
                            el: <div>Most Viewed</div>,
                            value: "MostViewed"
                        },
                        MostCommented:{
                            el: <div>Most Commented</div>,
                            value: "MostCommented"
                        },
                        Title:{
                            el: <div>Title</div>,
                            value: "Title"
                        },
                    }}
                    propVal={sortedBy}
                    cb={(s)=>updateQuery({ sort: s })}/>
                </div>
            </div>
            <div className="forum-new-post-container">
                {user?
                    <Link href="/new-post" className="main-button">Create new Post</Link>:
                    <button className="main-button" onClick={()=>setIsLoginMenuActive(true)}>
                        Login to post
                    </button>
                }
            </div>
            <PaginatedPost currPage={currPage}
                maxCount={maxCount}
                pageLimit={appConfig.paging.postsPerPage}
                postList={postList}
                fetchPost={(page)=>updateQuery({ page })}
                isLoading={isFetching}/>
        </div>
    </div>
}
