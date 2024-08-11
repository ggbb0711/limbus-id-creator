import { IComment } from "Interfaces/IPost/IComment";
import React from "react";
import { Link } from "react-router-dom";


export default function Comment({comment}:{comment:IComment}){
    return <div className="post-comment-container post-page-element-container">
    <div className="center-element post-comment-content">
        <div className="center-element post-comment-header">
            <div className="center-element">
                <Link to={"/User/"+comment.userId}><img className="post-author-icon-small" src={comment.userIcon} alt="author-icon" /></Link>
                <Link to={"/User/"+comment.userId}><p className="post-author-name">{comment.userName}</p></Link>
            </div>
        </div>
        <p className="post-date">Posted: {comment.date.split(" ")[0]}</p>
        <p className="description-txt" dangerouslySetInnerHTML={{__html:comment.comment}}></p>
    </div>
</div>
}