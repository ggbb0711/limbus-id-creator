import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./PaginatedPost.css"
import ReactPaginate from "react-paginate";
import { IPostDisplayCard } from "Interfaces/IPostDisplayCard/IPostDisplayCard";
import PostDisplayList from "component/PostDisplayList/PostDisplayList";

export default function PaginatedPost({currPage,maxCount,pageLimit,postList,fetchPost,isLoading}:{currPage:number,maxCount:number,pageLimit:number,postList:IPostDisplayCard[],fetchPost:(page:number)=>void,isLoading:boolean}){
    const headPost = useRef(null)
    
    function changePage(page:number){
        if(headPost) headPost.current.scrollIntoView()
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