import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import TagInput from "utils/TagInput/TagInput";
import { ITag } from "utils/TagList";
import "./ForumPage.css"
import TagsContainer from "utils/TagsContainer/TagsContainer";
import MainButton from "utils/MainButton/MainButton";
import { useLoginUserContext } from "component/context/LoginUserContext";
import { useLoginMenuContext } from "component/LoginMenu/LoginMenu";
import { Link, useSearchParams } from "react-router-dom";
import DropDown from "component/DropDown/DropDown";
import { useAlertContext } from "component/context/AlertContext";
import { IPostDisplayCard } from "Interfaces/IPostDisplayCard/IPostDisplayCard";
import PaginatedPost from "../PaginatedPost/PaginatedPost";


export default function ForumPage():ReactElement{
    const [postList,setPostList] = useState<IPostDisplayCard[]>([])
    const [searchPostName,setSearchPostName] = useState("")
    const [tags,setTags] = useState<ITag[]>([])
    const [sortedBy,setSortedBy] = useState("Latest")
    const [currPage,setCurrPage] = useState(0)
    const [maxCount,setMaxCount] = useState(0)
    const [isLoading,setIsLoading] = useState(false)
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()
    const {addAlert} = useAlertContext()

    async function getPosts(page:number){
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Post?Title=${searchPostName}&Tag=${tags.map(t=>t.tagName).join(",")}&SortedBy=${sortedBy}&page=${page}&limit=10`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok){
                addAlert("Failure",result.msg)
                setPostList([])
            }
            else{ 
                const newList = result.response.list.map((p)=>({
                    ...p,
                    cardImg:p.imagesAttach[0]
                }))
                setPostList(newList)
                setMaxCount(result.response.total)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
            setPostList([])
        }
        setIsLoading(false)
    }

    useEffect(()=>{
        if(currPage!==0)setCurrPage(0)
        else{
            getPosts(0)
        }
    },[tags.toString(),searchPostName,sortedBy])

    useEffect(()=>{
        getPosts(currPage)
    },[currPage])

    return <div className="page-container">
        <div className="page-content">
            <div className="forum-input-container">
                <label htmlFor="name">Post name:</label>
                <input type="text" name="searchPostName" id="searchPostName" className="input" placeholder="Search" value={searchPostName} onChange={(e)=>setSearchPostName(e.target.value)}/>           
            </div>
            <div className="forum-input-container">
                <label htmlFor="tag">Tags:</label>
                <TagInput completeFn={(tag)=>{setTags([...new Set([...tags,tag])])}} maxTag={22} customClass={"input"} id={"tag"} ></TagInput>
            </div>
            <TagsContainer tags={tags} deleteTag={(i)=>{
                const newTags = [...tags]
                newTags.splice(i,1)
                setTags(newTags)
            }}/>
            <div className="center-element">
                <p>Sorted by: </p>
                <div className="forum-sorted-by">
                    <DropDown dropDownEl={{
                        Latest:{
                            el: <div>Latest</div>,
                            value:"Latest"
                        },
                        Earliest:{
                            el: <div>Earliest</div>,
                            value:"Earliest"
                        },
                        Most_Viewed:{
                            el: <div>Most Viewed</div>,
                            value:"Most_Viewed"
                        },
                        Most_Commented:{
                            el: <div>Most Commented</div>,
                            value:"Most_Commented"
                        },
                        Title:{
                            el: <div>Title</div>,
                            value:"Title"
                        },
                    }}
                    propVal={sortedBy}
                    cb={(s)=>setSortedBy(s)}/>
                </div>
            </div>
            <div className="forum-new-post-container">
                {loginUser?
                <Link to={"/NewPost"}><MainButton component={'Create new Post'} btnClass={"main-button"} /></Link>:
                <MainButton btnClass="main-button" component={"Login to post"} clickHandler={()=>setIsLoginMenuActive(true)}/>}
            </div>
            <PaginatedPost currPage={currPage} 
                maxCount={maxCount} 
                pageLimit={10} 
                postList={postList}
                fetchPost={setCurrPage}
                isLoading={isLoading}/>
        </div>
    </div>
}