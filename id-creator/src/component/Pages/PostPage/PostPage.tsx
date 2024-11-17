import React, { useState } from "react";
import { ReactElement } from "react";
import "../PageLayout.css"
import "./PostPage.css"
import Post from "./Post/Post";
import CommentContainer from "./CommentContainer/CommentContainer";
import { useAlertContext } from "component/context/AlertContext";
import { useParams } from "react-router-dom";
import { IPost } from "Interfaces/IPost/IPost";
import PostCommentInput from "./PostCommentInput/PostCommentInput";
import { useLoginUserContext } from "component/context/LoginUserContext";
import { useLoginMenuContext } from "component/util/LoginMenu/LoginMenu";
import MainButton from "utils/MainButton/MainButton";
import { IComment } from "Interfaces/IPost/IComment";

export default function PostPage():ReactElement{
    const {postId} = useParams()
    const [post,setPost] = useState<IPost>({
        id:"",
        title:"",
        imagesAttach:[],
        description:"",
        userIcon:"",
        userName:"",
        userId:"",
        tags:[],
        viewCount:0,
        commentCount:0,
        created: "",
    })
    const [comments,setComments] = useState<IComment[]>([])
    const {addAlert} = useAlertContext()
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()

    async function getPost(){
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Post/${postId}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok){
                addAlert("Failure",result.msg)
                setPost(null)
            }
            else setPost(result.response)
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
            setPost(null)
        }
    }

    async function createNewComment(comment:string){
        try {
            if(!comment) return addAlert("Failure","Comment cannot be emptied")
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Comment/create`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body: JSON.stringify({
                    userId: loginUser.id,
                    postId: post.id,
                    comment,
                })})
            const result = await response.json()
            if(!response.ok||!result.response) addAlert("Failure",result.msg)
            else{ 
                setComments([...comments,result.response])
                addAlert("Success","Comment posted")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
    }
    async function getComments(page:number,limit:number){
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Comment?PostId=${postId}&page=${page}&limit=${limit}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else setComments([...comments,...result.response])
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server. Cannot get comments")
        }
    }

    return <div className="page-container">
        <div className="page-content">
            <Post post={post} getPost={getPost}/>
        </div>
        <div className="page-content">
            <CommentContainer comments={comments} getComments={getComments}/>
        </div>
        <div className="page-content">
            {(()=>{
                if(loginUser && post) return <PostCommentInput authorIcon={loginUser.userIcon} authorName={loginUser.userName} createComment={createNewComment}/>
                if(post) <MainButton btnClass="main-button" component={"Login to comment"} clickHandler={()=>setIsLoginMenuActive(true)}/>
                return <></>
            })()}
        </div>
    </div>
}