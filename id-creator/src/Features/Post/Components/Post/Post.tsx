import React, { useState, useEffect } from "react";
import { ReactElement } from "react";
import { IPost } from "Types/IPost/IPost";
import { ITag, TagList } from "Utils/TagList";
import { Link } from "react-router-dom";
import ViewIcon from "Assets/Icons/ViewIcon";
import CommentIcon from "Assets/Icons/CommentIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import ArrowUpIcon from "Assets/Icons/ArrowUpIcon";
import CloseIcon from "Assets/Icons/CloseIcon";
import UserProfileLoading from "Components/UserProfileLoading/UserProfileLoading";
import {MapInteractionCSS} from "react-map-interaction"
import "./Post.css";
import "../Shared/Style.css"

function CardTag({card}:{card:ITag}):ReactElement{
    return <div className="card-tag center-element">
        {card?.icon&&<img className="card-tag-img" src={card?.icon} alt="card-tag"/>}
        <p>{card?.tagName}</p>
    </div>
}

function ViewImagePopUp({images,index=0,isActive,closeFn}:{images:string[],index:number,isActive:boolean,closeFn:()=>void}){
    const [currChoice,setCurrChoice] = useState(index)
    
    useEffect(()=>{setCurrChoice(index)},[index])

    return <>
        {isActive?<div className="image-pop-up-container">
            <MapInteractionCSS>
                {images.map((image,i)=><img key={i} src={image} alt="view-img" className={`image-pop-up ${i!=currChoice?"hidden":""}`} />)}
            </MapInteractionCSS>
            <div className="image-pop-up-close" onClick={()=>{
                    setCurrChoice(index)
                    closeFn()
                }}>
            <CloseIcon/>
            </div>
            {currChoice>0?<div className="image-pop-up-arrow left" onClick={()=>setCurrChoice(currChoice-1)}>
                <ArrowDownIcon/>
            </div>:<></>}
            {currChoice<images.length-1?<div className="image-pop-up-arrow right" onClick={()=>setCurrChoice(currChoice+1)}>
                <ArrowUpIcon/>
            </div>:<></>}
        </div>
        :<></>}
    </>
}

function PostCarousel({postImages}:{postImages:string[]}){
    const [currImg,setCurrImg] = useState(0)
    const [isViewModeActive,setIsViewModeActive] = useState(false)
    
    return <div className="post-carousel-container">
        {currImg>0?<div className="post-carousel-arrow left" onClick={()=>setCurrImg(currImg-1)}>
            <ArrowDownIcon/>
        </div>
        :<></>}
        {postImages.map((image,i)=><img key={i} className={`post-img ${i!=currImg?"hidden":""}`} src={image} alt="card-img" onClick={()=>{
                setIsViewModeActive(true)
            }}/>)}
        <ViewImagePopUp images={postImages} index={currImg} isActive={isViewModeActive} closeFn={()=>{
                setIsViewModeActive(false)
            }}/>
        {currImg<postImages.length-1?<div className="post-carousel-arrow right" onClick={()=>setCurrImg(currImg+1)}>
            <ArrowUpIcon/>
        </div>
        :<></>}
        
    </div>
}

export default function Post({post,isLoading}:{post:IPost|null,isLoading:boolean}):ReactElement{
    return <div className="post-container post-page-element-container">
        {!post?<div>Post not found</div>:<>
            <h1 className="post-title">{post.title}</h1>
            {isLoading?<></>:<p className="post-date">Posted: {new Date(post.created).toLocaleDateString()}</p>}
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
                    <ViewIcon width={16} height={16}/>
                    {post.viewCount}
                </div>
                <div className="card-tag center-element">
                    <CommentIcon width={16} height={16}/>
                    {post.commentCount}
                </div>
            </div>
        </>}
    </div>
}