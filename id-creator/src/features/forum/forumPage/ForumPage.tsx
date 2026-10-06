'use client'
import { canAddTag } from "utils/canAddTag";
import { appConfig } from "config/env.client";
import { useEffect, useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginatedPost, PostSortOption, TagInput, TagList, TagsContainer, usePaginatedPosts } from "features/post";
import "./ForumPage.css"
import DropDown, { DropDownOption } from "components/ui/dropDown/DropDown";
import { useAuth } from "hooks/useAuth";
import { ForumQueryUpdate, buildForumQuery, parseSort, tagKeyOf } from "features/forum/utils/forumQuery";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";


const SORT_LABELS: Record<PostSortOption, string> = {
    Latest: "Latest",
    Earliest: "Earliest",
    MostViewed: "Most Viewed",
    MostCommented: "Most Commented",
    Title: "Title",
}

const SORT_OPTIONS: DropDownOption<PostSortOption>[] = (Object.keys(SORT_LABELS) as PostSortOption[]).map(value => ({ value, el: <div>{SORT_LABELS[value]}</div> }))

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

    const { postList, maxCount, pageSize, isFetching } = usePaginatedPosts(currPage, {
        title: urlSearch,
        tag: tags.map(t => t.tagName),
        sortedBy,
    })

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
                    <DropDown<PostSortOption> options={SORT_OPTIONS} value={sortedBy} onChange={(s)=>updateQuery({ sort: s })} label="Sort posts by"/>
                </div>
            </div>
            <div className="forum-new-post-container">
                {user?
                    <Link href="/new-post" className="main-button">Create new Post</Link>:
                    <LoginPromptButton>Login to post</LoginPromptButton>
                }
            </div>
            <PaginatedPost currPage={currPage}
                maxCount={maxCount}
                pageLimit={pageSize}
                postList={postList}
                fetchPost={(page)=>updateQuery({ page })}
                isLoading={isFetching}/>
        </div>
    </div>
}
