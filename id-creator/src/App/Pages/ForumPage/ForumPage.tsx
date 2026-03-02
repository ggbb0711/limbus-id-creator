import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { ITag } from "Utils/TagList";
import "./ForumPage.css"
import { Link } from "react-router-dom";
import DropDown from "Components/DropDown/DropDown";
import { useLoginMenu } from "Hooks/useLoginMenu";
import PaginatedPost from "Components/PaginatedPost/PaginatedPost";
import TagInput from "Components/TagInput/TagInput";
import TagsContainer from "Components/TagsContainer/TagsContainer";
import useAlert from "Hooks/useAlert";
import { useCheckAuthQuery } from "Api/AuthApi";
import { useGetPostsQuery } from "Api/PostAPI";

export default function ForumPage():ReactElement{
    const [searchPostName,setSearchPostName] = useState("")
    const [tags,setTags] = useState<ITag[]>([])
    const [sortedBy,setSortedBy] = useState("Latest")
    const [currPage,setCurrPage] = useState(0)
    const {data: user} = useCheckAuthQuery()
    const {setIsLoginMenuActive} = useLoginMenu()
    const {addAlert} = useAlert()

    const { data, isLoading, error } = useGetPostsQuery({
        title: searchPostName,
        tag: tags.map(t => t.tagName),
        sortedBy,
        page: currPage,
        limit: 10,
    })

    const postList = data?.list.map((p) => ({
        ...p,
        cardImg: p.imagesAttach[0]
    })) ?? []
    const maxCount = data?.total ?? 0

    useEffect(() => {
        if (error) addAlert("Failure", "Something went wrong with the server")
    }, [error])

    useEffect(() => {
        setCurrPage(0)
    }, [tags.toString(), searchPostName, sortedBy])

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
                {user?
                    <Link to={"/new-post"}>
                        <button className="main-button">Create new Post</button>
                    </Link>:
                    <button className="main-button" onClick={()=>setIsLoginMenuActive(true)}>
                        Login to post
                    </button>
                }
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