import React from "react";
import { ReactElement } from "react";
import './PostDisplayList.css'
import PostDisplayCard from "./PostDisplayCard/PostDisplayCard";
import PostDisplayCardLoading from "./PostDisplayCard/PostDisplayCardLoading";
import { IPostDisplayCard } from "Interfaces/IPostDisplayCard/IPostDisplayCard";

export default function PostDisplayList({isLoading,cardList}:{cardList:IPostDisplayCard[],isLoading:boolean}):ReactElement{
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