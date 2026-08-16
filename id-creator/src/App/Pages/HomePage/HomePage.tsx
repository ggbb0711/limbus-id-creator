import React from "react";
import "./HomePage.css"
import "../Shared/Styles/PageLayout.css";
import "Components/PaginatedPost/PaginatedPost.css";
import { Link } from "react-router-dom";
import { PostDisplayCard, PostDisplayCardLoading } from "Components/PaginatedPost/PaginatedPost";
import { useGetPostsQuery } from "Api/PostAPI";
import { PostSortOptions } from "Types/Enums/PostSortOptions";

export default function HomePage(){
    const { data, isLoading } = useGetPostsQuery({ sortedBy: PostSortOptions.Latest, page: 0, limit: 4 })

    const latestPosts = data?.list.map((p) => ({
        ...p,
        cardImg: p.imagesAttach[0]
    })) ?? []

    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <img src="/Images/SiteLogo.webp" alt="limbus-id-maker-logog" className="hero-site-logo"></img>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href="https://limbuscompany.com/" className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                <Link to={"/creator/identity"}>
                    <button className="main-button nav-button">
                        Create Id
                    </button>
                </Link>
                <Link to={"/creator/ego"}>
                    <button className="main-button nav-button">
                        Create Ego
                    </button>
                </Link>
                <Link to={"/forum"}>
                    <button className="main-button nav-button">
                        Forum
                    </button>
                </Link>
            </div>
        </div>
        <div className="page-content latest-posts-section">
            <div className="latest-posts-header">
                <h2 className="page-title">Latest Posts</h2>
                <Link to="/forum" className="latest-posts-view-all">View all</Link>
            </div>
            <div className="post-display-list">
                {isLoading?
                    <>
                        <PostDisplayCardLoading/>
                        <PostDisplayCardLoading/>
                        <PostDisplayCardLoading/>
                        <PostDisplayCardLoading/>
                    </>
                    :
                    latestPosts.length>0?
                        latestPosts.map((post)=><PostDisplayCard key={post.id} {...post}/>)
                        :
                        <p className="latest-posts-empty">No posts yet. Be the first to share your creation!</p>
                }
            </div>
        </div>
    </div>
}