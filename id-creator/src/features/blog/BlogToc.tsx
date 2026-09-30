'use client'
import React, { useEffect, useState } from "react";
import { IBlogHeading } from "./posts";

export default function BlogToc({ headings }: { headings: IBlogHeading[] }) {
    const [activeId, setActiveId] = useState(headings[0]?.id)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const elements = headings
            .map((h) => document.getElementById(h.id))
            .filter((el): el is HTMLElement => !!el)
        if (elements.length === 0) return

        let frame = 0
        const update = () => {
            frame = 0
            const passed = elements.filter((el) => el.getBoundingClientRect().top <= 120)
            setActiveId((passed[passed.length - 1] ?? elements[0]).id)
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [headings])

    return <nav className={`blog-toc ${isOpen ? "open" : ""}`} aria-label="On this page">
        <button type="button" className="blog-toc-toggle" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
            On this page
            <span className="blog-toc-toggle-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>
        <p className="blog-toc-title">On this page</p>
        <ul className="blog-toc-list">
            {headings.map((h) => (
                <li key={h.id} className={`blog-toc-item depth-${h.depth}`}>
                    <a href={`#${h.id}`} className={h.id === activeId ? "active" : ""} onClick={() => {
                        setActiveId(h.id)
                        setIsOpen(false)
                    }}>{h.text}</a>
                </li>
            ))}
        </ul>
    </nav>
}
