import React, { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import "./PaginatedPost.css"
import { IPostDisplayCard } from "types/iPostDisplayCard/IPostDisplayCard";
import CommentIcon from "assets/icons/CommentIcon";
import ViewIcon from "assets/icons/ViewIcon";
import { TagList } from "utils/TagList";

export function PostDisplayCard({id,title,cardImg,userIcon,userName,userId,created,tags,viewCount,commentCount}:IPostDisplayCard){
    return <div className="post-display-card">
        <Link href={"/post/"+id}>
            <div className="post-display-card-img-container">
                <Image className="post-display-card-img" src={cardImg} alt={title} width={1440} height={1000} sizes="(max-width: 940px) 100vw, 580px" quality={90} />
            </div>
        </Link>
        <div className="post-display-card-footer">
            <p className="post-display-meta-txt">Posted: {created.split(" ")[0]}</p>
            <div className="post-display-tag-container">
                {tags.slice(0,3).map((t,i)=><div key={i} className="post-display-card-tag">
                    {TagList[t]?.icon&&<Image className="post-display-card-tag-img" src={TagList[t]?.icon} alt={t+"_icon"} width={12} height={12} />}
                    <p>{TagList[t]?.tagName}</p>
                </div>)}
                {tags.length>3&&<p className="post-display-meta-txt">({tags.length-3} more)</p>}
            </div>
            <div className="center-element">
                <Link href={"/user/"+userId}>
                    <Image className="post-display-card-footer-author-icon" src={userIcon} alt={userName+" avatar"} width={40} height={40} />
                </Link>
                <div className="post-display-card-footer-description">
                    <Link href={"/post/"+id} className="post-display-card-title">
                        <p>{title}</p>
                    </Link>
                    <Link href={"/user/"+userId}>
                        <p className="post-display-card-footer-author-name">{userName}</p>
                    </Link>
                </div>
            </div>
            <div className="post-display-tag-container r">
                <div className="post-display-card-tag">
                    <ViewIcon width={12} height={12}/>
                    {viewCount}
                </div>
                <div className="post-display-card-tag">
                    <CommentIcon width={12} height={12}/>
                    {commentCount}
                </div>
            </div>
        </div>
    </div>
}

export function PostDisplayCardLoading():ReactElement{
    return <div className="post-display-card-loading">
        <div className="loader"></div>
    </div>
}
