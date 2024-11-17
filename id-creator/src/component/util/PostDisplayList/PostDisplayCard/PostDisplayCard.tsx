import React from "react";
import './PostDisplayCard.css'
import { IPostDisplayCard } from "Interfaces/IPostDisplayCard/IPostDisplayCard";
import View_icon from "Icons/View_icon";
import Comment_icon from "Icons/Comment_icon";
import { TagList } from "utils/TagList";
import { Link } from "react-router-dom";

export default function PostDisplayCard({id,title,cardImg,userIcon,userName,userId,created,tags,viewCount,commentCount}:IPostDisplayCard){
    return <div className="post-display-card">
        <Link to={"/Post/"+id}>
            <div className="post-display-card-img-container">
                <img className="post-display-card-img" src={cardImg} alt={title} />
            </div>
        </Link>
        <div className="post-display-card-footer">
            <p className="post-display-meta-txt">Posted: {created.split(" ")[0]}</p>
            <div className="post-display-tag-container">
                {tags.slice(0,3).map((t,i)=><div key={i} className="post-display-card-tag">
                    {TagList[t]?.icon&&<img className="post-display-card-tag-img" src={TagList[t]?.icon} alt={t+"_icon"} />}
                    <p>{TagList[t]?.tagName}</p>
                </div>)}
                {tags.length>3&&<p className="post-display-meta-txt">({tags.length-3} more)</p>}
            </div>
            <div className="center-element">
                <Link to={"/User/"+userId}>
                    <img className="post-display-card-footer-author-icon" src={userIcon} alt="author-icon" />
                </Link>
                <div className="post-display-card-footer-description">
                    <Link to={"/Post/"+id} className="post-display-card-title">
                        <p>{title}</p>
                    </Link>
                    <Link to={"/User/"+userId}>
                        <p className="post-display-card-footer-author-name">{userName}</p>
                    </Link>
                </div>
            </div>
            <div className="post-display-tag-container r">
                <div className="post-display-card-tag">
                    <View_icon width={12} height={12}/>
                    {viewCount}
                </div>
                <div className="post-display-card-tag">
                    <Comment_icon width={12} height={12}/>
                    {commentCount}
                </div>
            </div>
        </div>
    </div>
}