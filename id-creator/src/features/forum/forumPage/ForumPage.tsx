'use client'
import { canAddTag } from "utils/canAddTag";
import { appConfig } from "config/env.client";
import { useCallback, useEffect, useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InitialPostPage, PaginatedPost, PostSortOption, TagInput, TagList, TagsContainer, tagKeyOf, usePaginatedPosts } from "features/post";
import "./ForumPage.css"
import DropDown, { DropDownOption } from "components/ui/dropDown/DropDown";
import { useAuth } from "hooks/useAuth";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { ForumQueryUpdate, buildForumQuery, parseForumParams } from "features/forum/utils/forumQuery";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";

const SORT_LABELS: Record<PostSortOption, string> = {
    Latest: "Latest",
    Earliest: "Earliest",
    MostViewed: "Most Viewed",
    MostCommented: "Most Commented",
    Title: "Title",
}

const SORT_OPTIONS: DropDownOption<PostSortOption>[] = (Object.keys(SORT_LABELS) as PostSortOption[]).map(value => ({ value, el: <div>{SORT_LABELS[value]}</div> }))

type HistoryMode = "push" | "replace"

export default function ForumPage({ initialPosts }: { initialPosts?: InitialPostPage }): ReactElement {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { q: urlSearch, tagKeys, sort: sortedBy, page: currPage } = parseForumParams(searchParams)
    const tags = tagKeys.map(key => TagList[key])
    const [searchPostName, setSearchPostName] = useState(urlSearch)
    const [syncedSearch, setSyncedSearch] = useState(urlSearch)

    if (syncedSearch !== urlSearch) {
        setSyncedSearch(urlSearch)
        setSearchPostName(urlSearch)
    }

    const { user, isInitializing } = useAuth()

    const updateQuery = useCallback((next: ForumQueryUpdate, mode: HistoryMode = "push") => {
        const query = buildForumQuery(window.location.search, next)
        const url = query ? `${pathname}?${query}` : pathname
        if (mode === "push") router.push(url, { scroll: false })
        else router.replace(url, { scroll: false })
    }, [pathname, router])

    const debouncedSearch = useDebouncedValue(searchPostName, appConfig.timing.searchDebounceMs)

    useEffect(() => {
        if (debouncedSearch !== searchPostName || debouncedSearch === urlSearch) return
        updateQuery({ q: debouncedSearch }, "replace")
    }, [debouncedSearch, searchPostName, urlSearch, updateQuery])

    const { postList, maxCount, pageSize, isLoading, error, refetch } = usePaginatedPosts(currPage, {
        title: urlSearch,
        tag: tags.map(t => t.tagName),
        sortedBy,
    }, initialPosts)

    return <div className="page-container">
        <div className="page-content">
            <div className="forum-input-container">
                <label htmlFor="searchPostName">Post name:</label>
                <input type="text" name="searchPostName" id="searchPostName" className="input" placeholder="Search" value={searchPostName} onChange={(e) => setSearchPostName(e.target.value)}/>
            </div>
            <div className="forum-input-container">
                <label htmlFor="tag">Tags:</label>
                <TagInput completeFn={(tag) => {
                    const key = tagKeyOf(tag)
                    if (key && canAddTag(tagKeys, key, appConfig.limits.post.maxForumFilterTags)) updateQuery({ tag: [...tagKeys, key] })
                }} maxTag={appConfig.limits.post.maxForumFilterTags} selectedCount={tagKeys.length} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            <TagsContainer tags={tags} deleteTag={(i) => updateQuery({ tag: tagKeys.filter((_, index) => index !== i) })}/>
            <div className="center-element">
                <p>Sorted by: </p>
                <div className="forum-sorted-by">
                    <DropDown<PostSortOption> options={SORT_OPTIONS} value={sortedBy} onChange={(s) => updateQuery({ sort: s })} label="Sort posts by"/>
                </div>
            </div>
            <div className="forum-new-post-container">
                {isInitializing ? null : user ?
                    <Link href="/new-post" className="main-button">Create new Post</Link> :
                    <LoginPromptButton>Login to post</LoginPromptButton>
                }
            </div>
            <PaginatedPost currPage={currPage}
                maxCount={maxCount}
                pageLimit={pageSize}
                postList={postList}
                fetchPost={(page) => updateQuery({ page })}
                isLoading={isLoading}
                error={error}
                onRetry={refetch}/>
        </div>
    </div>
}
