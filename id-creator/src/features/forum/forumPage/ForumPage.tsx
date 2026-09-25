'use client'
import { useEffect, useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ITag, TagList } from "utils/TagList";
import "./ForumPage.css"
import DropDown from "components/dropDown/DropDown";
import { useLoginMenu } from "hooks/useLoginMenu";
import PaginatedPost from "components/paginatedPost/PaginatedPost";
import TagInput from "components/tagInput/TagInput";
import TagsContainer from "components/tagsContainer/TagsContainer";
import useAlert from "hooks/useAlert";
import { useAuth } from "hooks/useAuth";
import { useGetPostsQuery } from "api/PostAPI";
import getApiErrorMessage from "utils/getApiErrorMessage";
import { PostSortOptions } from "types/enums/PostSortOptions";

const tagKeyOf = (tag: ITag) => Object.keys(TagList).find((key) => TagList[key].tagName === tag.tagName)

function parseSort(value: string | null): PostSortOptions {
    const sort = value ? PostSortOptions[value as keyof typeof PostSortOptions] : undefined
    return sort ?? PostSortOptions.Latest
}

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

    function updateQuery(next: { q?: string, tag?: string[], sort?: PostSortOptions, page?: number }) {
        const params = new URLSearchParams(searchParams.toString())
        if (next.q !== undefined) {
            if (next.q) params.set("q", next.q)
            else params.delete("q")
        }
        if (next.tag !== undefined) {
            params.delete("tag")
            next.tag.forEach((key) => params.append("tag", key))
        }
        if (next.sort !== undefined) {
            if (next.sort === PostSortOptions.Latest) params.delete("sort")
            else params.set("sort", PostSortOptions[next.sort])
        }

        const page = next.page ?? 0
        if (page > 0) params.set("page", String(page))
        else params.delete("page")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }


    useEffect(() => {
        setSearchPostName(urlSearch)
    }, [urlSearch])


    useEffect(() => {
        if (searchPostName === urlSearch) return
        const timeout = setTimeout(() => updateQuery({ q: searchPostName }), 300)
        return () => clearTimeout(timeout)
    }, [searchPostName])

    const { data, isFetching, error } = useGetPostsQuery({
        title: urlSearch,
        tag: tags.map(t => t.tagName),
        sortedBy,
        page: currPage,
        limit: 10,
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
                    if (key) updateQuery({ tag: [...new Set([...tagKeys, key])] })
                }} maxTag={22} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            <TagsContainer tags={tags} deleteTag={(i)=>{
                const newTagKeys = [...tagKeys]
                newTagKeys.splice(i,1)
                updateQuery({ tag: newTagKeys })
            }}/>
            <div className="center-element">
                <p>Sorted by: </p>
                <div className="forum-sorted-by">
                    <DropDown<PostSortOptions> dropDownEl={{
                        Latest:{
                            el: <div>Latest</div>,
                            value: PostSortOptions.Latest
                        },
                        Earliest:{
                            el: <div>Earliest</div>,
                            value: PostSortOptions.Earliest
                        },
                        MostViewed:{
                            el: <div>Most Viewed</div>,
                            value: PostSortOptions.MostViewed
                        },
                        MostCommented:{
                            el: <div>Most Commented</div>,
                            value: PostSortOptions.MostCommented
                        },
                        Title:{
                            el: <div>Title</div>,
                            value: PostSortOptions.Title
                        },
                    }}
                    propVal={PostSortOptions[sortedBy]}
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
                pageLimit={10}
                postList={postList}
                fetchPost={(page)=>updateQuery({ page })}
                isLoading={isFetching}/>
        </div>
    </div>
}
