import React, { useState } from "react";
import MainButton from "utils/MainButton/MainButton";
import Editor from 'react-simple-wysiwyg';
import { Link } from "react-router-dom";

export default function PostCommentInput({authorIcon,authorName,createComment}:{authorIcon:string,authorName:string,createComment:(comment:string)=>Promise<void>}){
    const [commentValue,setCommentValue] = useState("")
    const [isPosting,setIsPosting] = useState(false)

    return<div className="center-element post-comment-content post-page-element-container">
        <div className="center-element">
            <img className="post-author-icon-small" src={authorIcon} alt="author-icon" />
            <p className="post-author-name">{authorName}</p>
        </div>
        <Editor className="input comment-input" name="comment" id="comment" value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
        {isPosting?<MainButton btnClass="main-button active" component={"Posting..."} />:
        <MainButton btnClass="main-button" component={"Post"} clickHandler={()=>{
            setIsPosting(true)
            createComment(commentValue).finally(()=>{
                setIsPosting(false)
                setCommentValue("")
            })
        }}/>}
        
    </div>
}