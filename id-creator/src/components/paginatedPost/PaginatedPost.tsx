'use client'
import React, { ReactElement, useRef } from "react";
import "./PaginatedPost.css"
import ReactPaginate from "react-paginate";
import { IPostDisplayCard } from "types/iPostDisplayCard/IPostDisplayCard";
import { PostDisplayCard, PostDisplayCardLoading } from "./PostDisplayCard";

function PostDisplayList({isLoading,cardList}:{cardList:IPostDisplayCard[],isLoading:boolean}):ReactElement{
    return <div className="post-display-list">
        {isLoading?
            <>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
            </>
            :
            <>
                {cardList.length<1?
                    "No posts found :(":
                    <>
                        {cardList.map((c,i)=><PostDisplayCard key={i} {...c}></PostDisplayCard>)}
                    </>
                }
            </>
        }        
    </div>
}

export default function PaginatedPost({currPage,maxCount,pageLimit,postList,fetchPost,isLoading}:{currPage:number,maxCount:number,pageLimit:number,postList:IPostDisplayCard[],fetchPost:(page:number)=>void,isLoading:boolean}){
    const headPost = useRef<HTMLDivElement>(null)
    
    function changePage(page:number){
        if(headPost.current) headPost.current.scrollIntoView()
        fetchPost(page)
    }

    
    return <div className="paginated-post-container">
        <div className="paginated-post-nav-container" ref={headPost} id="head-post">
            <ReactPaginate className="center-element paginated-bullet-point-container"
                pageCount={maxCount/pageLimit}
                forcePage={currPage} 
                onPageChange={(e)=>changePage(e.selected)}
                pageClassName="paginated-bullet-point"
                activeClassName="paginated-bullet-point active"
                breakLabel={"..."}
                previousLabel={<p className="paginated-bullet-point">PREV</p>}
                nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
        </div>
        <PostDisplayList isLoading={isLoading} cardList={postList}/>
        <div className="paginated-post-nav-container">
        <ReactPaginate className="center-element paginated-bullet-point-container"
            pageCount={maxCount/pageLimit}
            forcePage={currPage} 
            onPageChange={(e)=>changePage(e.selected)}
            pageClassName="paginated-bullet-point"
            activeClassName="paginated-bullet-point active"
            breakLabel={"..."}
            previousLabel={<p className="paginated-bullet-point">PREV</p>}
            nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
        </div>
    </div>
}