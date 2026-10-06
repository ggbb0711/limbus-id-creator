import Link from "next/link";
import Image from "next/image";
import "./HomePage.css"
import { IPostDisplayCard, PostDisplayCard } from "features/post";
import siteLogo from "assets/images/SiteLogo.webp";
import { SITE_LINKS } from "config/siteLinks";
import { NAV_LINKS } from "config/navLinks";

export default function HomePage({ latestPosts }: { latestPosts: IPostDisplayCard[] | null }){
    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <Image src={siteLogo} alt="Limbus ID Creator logo" className="hero-site-logo" sizes="(max-width: 900px) 100vw, 850px" preload/>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href={SITE_LINKS.limbusCompany} className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                {NAV_LINKS.map(link => <Link key={link.href} href={link.href} className="main-button nav-button">{link.label}</Link>)}
            </div>
        </div>
        <div className="page-content latest-posts-section">
            <div className="latest-posts-header">
                <h2 className="page-title">Latest Posts</h2>
                <Link href="/forum" className="latest-posts-view-all">View all</Link>
            </div>
            <div className="post-display-list">
                {latestPosts === null ?
                    <p className="latest-posts-empty" role="alert">Latest posts are unavailable right now. Please try again later.</p>
                    : latestPosts.length > 0 ?
                    latestPosts.map((post)=><PostDisplayCard key={post.id} {...post}/>)
                    :
                    <p className="latest-posts-empty">No posts yet. Be the first to share your creation!</p>
                }
            </div>
        </div>
    </div>
}
