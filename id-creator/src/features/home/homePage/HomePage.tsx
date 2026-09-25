import Link from "next/link";
import Image from "next/image";
import "./HomePage.css"
import { PostDisplayCard } from "components/paginatedPost/PostDisplayCard";
import { IPost } from "types/iPost/IPost";
import siteLogo from "assets/images/SiteLogo.webp";

export default function HomePage({ latestPosts }: { latestPosts: IPost[] }){
    const cards = latestPosts.map((p) => ({
        ...p,
        cardImg: p.imagesAttach[0]
    }))

    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <Image src={siteLogo} alt="Limbus ID Creator logo" className="hero-site-logo" sizes="(max-width: 900px) 100vw, 850px" preload/>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href="https://limbuscompany.com/" className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                <Link href="/creator/identity" className="main-button nav-button">Create Id</Link>
                <Link href="/creator/ego" className="main-button nav-button">Create Ego</Link>
                <Link href="/forum" className="main-button nav-button">Forum</Link>
            </div>
        </div>
        <div className="page-content latest-posts-section">
            <div className="latest-posts-header">
                <h2 className="page-title">Latest Posts</h2>
                <Link href="/forum" className="latest-posts-view-all">View all</Link>
            </div>
            <div className="post-display-list">
                {cards.length>0?
                    cards.map((post)=><PostDisplayCard key={post.id} {...post}/>)
                    :
                    <p className="latest-posts-empty">No posts yet. Be the first to share your creation!</p>
                }
            </div>
        </div>
    </div>
}
