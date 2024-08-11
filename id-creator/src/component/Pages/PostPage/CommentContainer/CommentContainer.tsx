import { IComment } from "Interfaces/IPost/IComment";
import React, { useEffect, useRef, useState } from "react";
import Comment from "./Comment";



export default function CommentContainer({comments,getComments}:{comments:IComment[],getComments:(page:number,limit:number)=>Promise<void>}){
    const [isLoading,setIsLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [limit,setLimit] = useState(10)
    const loaderRef = useRef(null)

    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            const target = entries[0]
            if(target.isIntersecting&&isLoading)
            {
                setPage(page+1)
            }
        })

        if(loaderRef.current){
            observer.observe(loaderRef.current)
        }
        return () => {
            if (loaderRef.current) {
              observer.unobserve(loaderRef.current);
            }
          };
    },[getComments])

    useEffect(()=>{
        if(!isLoading){
            setIsLoading(true)
            getComments(page,limit).finally(()=>setIsLoading(false))
        }
    },[page])
    
    return <>
        {comments.map((comment,i)=><Comment key={i} comment={comment}/>)}
        <div ref={loaderRef}>{isLoading&&<div className="loader"></div>}</div>
    </>
}