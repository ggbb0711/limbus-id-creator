'use client'
import React, { useState, useEffect } from "react";
import { ReactElement } from "react";
import { IPost } from "types/iPost/IPost";
import { ITag, TagList } from "utils/TagList";
import Link from "next/link";
import Image from "next/image";
import ViewIcon from "assets/icons/ViewIcon";
import CommentIcon from "assets/icons/CommentIcon";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import ArrowUpIcon from "assets/icons/ArrowUpIcon";
import CloseIcon from "assets/icons/CloseIcon";
import UserProfileLoading from "components/userProfileLoading/UserProfileLoading";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import formatDisplayDate from "utils/formatDisplayDate";
import "./Post.css";
import "../shared/Style.css"

function CardTag({card}:{card:ITag}):ReactElement{
    return <div className="card-tag center-element">
        {card?.icon&&<Image className="card-tag-img" src={card?.icon} alt="card-tag" width={10} height={10}/>}
        <p>{card?.tagName}</p>
    </div>
}

function ViewImagePopUp({images,index=0,isActive,closeFn}:{images:string[],index:number,isActive:boolean,closeFn:()=>void}){
    const [currChoice,setCurrChoice] = useState(index)
    
    useEffect(()=>{setCurrChoice(index)},[index])

    return <>
        {isActive?<div className="image-pop-up-container">
            <TransformWrapper minScale={0.05} maxScale={3} limitToBounds={false} doubleClick={{disabled:true}}>
                <TransformComponent wrapperStyle={{width:"100%",height:"100%"}}>
                    {images.map((image,i)=><img key={i} src={image} alt="view-img" className={`image-pop-up ${i!=currChoice?"hidden":""}`} />)}
                </TransformComponent>
            </TransformWrapper>
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
        {postImages.map((image,i)=><Image key={i} className={`post-img ${i!=currImg?"hidden":""}`} src={image} alt="card-img" fill sizes="(max-width: 1200px) 100vw, 1200px" preload={i===0} style={{objectFit:"contain"}} onClick={()=>{
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
            {isLoading?<></>:<p className="post-date">Posted: {formatDisplayDate(post.created)}</p>}
            <div className="post-author-container">
                <div className="center-element">
                    {isLoading?<UserProfileLoading/>:
                    <Link href={"/user/"+post.userId}>
                        <Image className="post-author-icon" src={post.userIcon} alt={post.userName+" avatar"} width={80} height={80} />
                    </Link>}
                    <Link href={"/user/"+post.userId}>
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