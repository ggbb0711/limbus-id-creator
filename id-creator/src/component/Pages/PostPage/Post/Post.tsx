import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import CardTag from "./CardTag/CardTag";
import PostCarousel from "./PostCarousel/PostCarousel";
import { IPost } from "Interfaces/IPost/IPost";
import UserProfileLoading from "component/Pages/UserPage/User/UserProfileLoading";
import { TagList } from "utils/TagList";
import { Link } from "react-router-dom";
import View_icon from "Icons/View_icon";
import Comment_icon from "Icons/Comment_icon";


export default function Post({post,getPost}:{post:IPost,getPost:()=>Promise<void>}):ReactElement{
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        setIsLoading(true)
        getPost().finally(()=>setIsLoading(false))
    },[])

    return <div className="post-container post-page-element-container">
            {!post?<div>Post not found</div>:<>
                <h1 className="post-title">{post.title}</h1>
                {isLoading?<></>:<p className="post-date">Posted: {post.created.split(" ")[0]}</p>}
                <div className="post-author-container">
                    <div className="center-element">
                        {isLoading?<UserProfileLoading/>:
                        <Link to={"/User/"+post.userId}>
                            <img className="post-author-icon" src={post.userIcon} alt="author-icon" />
                        </Link>}
                        <Link to={"/User/"+post.userId}>
                            <p className="post-author-name">{post.userName}</p>
                        </Link>
                    </div>
                </div>
                <div className="center-element">
                    {post.tags.map((tag,i)=><CardTag key={i} card={TagList[tag]} />)}
                </div>
                {isLoading?<div className="post-img-loader">
                    <div className="loader"></div>
                </div>:<PostCarousel postImages={post.imagesAttach} />}
                <div className="description-txt" dangerouslySetInnerHTML={{__html:post.description}}>
                </div>
                <div className="center-element">
                    <div className="card-tag center-element">
                        <View_icon width={16} height={16}/>
                        {post.viewCount}
                    </div>
                    <div className="card-tag center-element">
                        <Comment_icon width={16} height={16}/>
                       {post.commentCount}
                    </div>
                </div>
            </>}
            
        </div>
}