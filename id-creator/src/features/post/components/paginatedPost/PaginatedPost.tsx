'use client'
import React, { ReactElement, ReactNode, useRef } from "react";
import "./PaginatedPost.css"
import ReactPaginate from "react-paginate";
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard";
import { PostDisplayCard, PostListSkeleton } from "./PostDisplayCard";

interface PaginationNavProps {
    page: number
    pageCount: number
    onChange: (page: number) => void
}

export function PaginationNav({ page, pageCount, onChange }: PaginationNavProps): ReactElement {
    return <ReactPaginate className="center-element paginated-bullet-point-container"
        pageCount={pageCount}
        forcePage={Math.min(page, Math.max(0, pageCount - 1))}
        onPageChange={(e) => onChange(e.selected)}
        pageClassName="paginated-bullet-point"
        activeClassName="paginated-bullet-point active"
        breakLabel={"..."}
        previousLabel={<p className="paginated-bullet-point">PREV</p>}
        nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
}

interface PaginatedPostProps {
    currPage: number
    maxCount: number
    pageLimit: number
    postList: IPostDisplayCard[]
    fetchPost: (page: number) => void
    isLoading: boolean
    error?: unknown
    onRetry?: () => void
}

export const pageCountOf = (total: number, pageLimit: number) => Math.ceil(total / Math.max(1, pageLimit))

function Message({ children }: { children: ReactNode }): ReactElement {
    return <div className="post-display-message">{children}</div>
}

export default function PaginatedPost({ currPage, maxCount, pageLimit, postList, fetchPost, isLoading, error, onRetry }: PaginatedPostProps) {
    const headPost = useRef<HTMLDivElement>(null)
    const pageCount = pageCountOf(maxCount, pageLimit)

    function changePage(page: number) {
        headPost.current?.scrollIntoView()
        fetchPost(page)
    }

    function renderList(): ReactNode {
        if (isLoading) return <div className="post-display-list" aria-busy="true"><PostListSkeleton count={pageLimit}/></div>
        if (error) return <Message>
            <p role="alert">Couldn&apos;t load posts.</p>
            {onRetry && <button type="button" className="main-button" onClick={onRetry}>Retry</button>}
        </Message>
        if (postList.length === 0 && currPage > 0 && pageCount > 0) return <Message>
            <p>This page doesn&apos;t exist.</p>
            <button type="button" className="main-button" onClick={() => changePage(pageCount - 1)}>Go to the last page</button>
        </Message>
        if (postList.length === 0) return <Message><p>No posts found :(</p></Message>
        return <div className="post-display-list">
            {postList.map(post => <PostDisplayCard key={post.id} {...post}/>)}
        </div>
    }

    return <div className="paginated-post-container">
        <div className="paginated-post-nav-container" ref={headPost} id="head-post">
            <PaginationNav page={currPage} pageCount={pageCount} onChange={changePage}/>
        </div>
        {renderList()}
        <div className="paginated-post-nav-container">
            <PaginationNav page={currPage} pageCount={pageCount} onChange={changePage}/>
        </div>
    </div>
}
