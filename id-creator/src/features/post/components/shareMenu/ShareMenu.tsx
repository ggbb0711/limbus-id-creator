'use client'
import React, { KeyboardEvent, ReactElement, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FacebookIcon, FacebookShareButton, RedditIcon, RedditShareButton, XIcon, XShareButton } from "react-share";
import "./ShareMenu.css"
import ShareIcon from "assets/icons/ShareIcon";
import LinkIcon from "assets/icons/LinkIcon";
import { useAddAlert } from "hooks/useAddAlert";
import { useClickOutside } from "hooks/useClickOutside";
import { copyToClipboard } from "utils/copyToClipboard";
import { cycleIndex } from "hooks/useCombobox";
import { reportError } from "utils/reportError";
import { absolutePostUrl } from "features/post/utils/postMetadata";
import { menuPosition } from "./menuPosition";

interface ShareMenuProps {
    postId: string
    title: string
    triggerClassName: string
    iconSize: number
}

const NETWORK_ICON_SIZE = 18
const subscribe = () => () => {}
const canShareNatively = () => typeof navigator !== "undefined" && typeof navigator.share === "function"
const cannotShareOnServer = () => false

export const isShareCancel = (error: unknown) => error instanceof Error && error.name === "AbortError"

export default function ShareMenu({ postId, title, triggerClassName, iconSize }: ShareMenuProps): ReactElement {
    const url = absolutePostUrl(postId)
    const menuId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const hasNativeShare = useSyncExternalStore(subscribe, canShareNatively, cannotShareOnServer)
    const addAlert = useAddAlert()

    const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

    function close(returnFocus: boolean) {
        setIsOpen(false)
        if (returnFocus) triggerRef.current?.focus()
    }

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current || !menuRef.current) return
        const menu = menuRef.current.getBoundingClientRect()
        setPosition(menuPosition(triggerRef.current.getBoundingClientRect(), menu, { width: window.innerWidth, height: window.innerHeight }))
        items()[0]?.focus()
    }, [isOpen])

    useClickOutside([menuRef, triggerRef], isOpen, () => setIsOpen(false))

    useEffect(() => {
        if (!isOpen) return
        const onViewportChange = (event: Event) => {
            if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false)
        }
        window.addEventListener("scroll", onViewportChange, true)
        window.addEventListener("resize", onViewportChange)
        return () => {
            window.removeEventListener("scroll", onViewportChange, true)
            window.removeEventListener("resize", onViewportChange)
        }
    }, [isOpen])

    function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const list = items()
        const current = list.indexOf(document.activeElement as HTMLElement)
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault()
                list[cycleIndex(current, list.length, event.key === "ArrowDown" ? 1 : -1)]?.focus()
                return
            case "Home":
                event.preventDefault()
                list[0]?.focus()
                return
            case "End":
                event.preventDefault()
                list[list.length - 1]?.focus()
                return
            case "Escape":
                event.preventDefault()
                close(true)
                return
            case "Tab":
                close(false)
                return
        }
    }

    async function copyLink() {
        close(true)
        const result = await copyToClipboard(url)
        if (result.ok) {
            addAlert("Success", "Link copied")
            return
        }
        reportError(result.error, { context: "copyPostLink" })
        addAlert("Failure", "Couldn't copy the link")
    }

    async function shareNatively() {
        close(true)
        try {
            await navigator.share({ title, url })
        } catch (error) {
            if (isShareCancel(error)) return
            reportError(error, { context: "nativeShare" })
            addAlert("Failure", "Couldn't open the share menu")
        }
    }

    const closeAfterShare = () => close(true)

    return <>
        <button ref={triggerRef} type="button" className={`${triggerClassName} share-menu-trigger`} aria-label="Share this post"
            aria-haspopup="menu" aria-expanded={isOpen} aria-controls={isOpen ? menuId : undefined}
            onClick={() => setIsOpen(open => !open)}>
            <ShareIcon width={`${iconSize}px`} height={`${iconSize}px`}/>
            <span aria-hidden="true">Share</span>
        </button>
        {isOpen && createPortal(
            <div ref={menuRef} id={menuId} role="menu" aria-label="Share options" className="share-menu"
                style={{ top: position.top, left: position.left }} onKeyDown={onMenuKeyDown}>
                <RedditShareButton url={url} title={title} role="menuitem" tabIndex={-1} resetButtonStyle={false} className="share-menu-item" onClick={closeAfterShare}>
                    <RedditIcon size={NETWORK_ICON_SIZE} round/>
                    <span>Reddit</span>
                </RedditShareButton>
                <FacebookShareButton url={url} role="menuitem" tabIndex={-1} resetButtonStyle={false} className="share-menu-item" onClick={closeAfterShare}>
                    <FacebookIcon size={NETWORK_ICON_SIZE} round/>
                    <span>Facebook</span>
                </FacebookShareButton>
                <XShareButton url={url} title={title} role="menuitem" tabIndex={-1} resetButtonStyle={false} className="share-menu-item" onClick={closeAfterShare}>
                    <XIcon size={NETWORK_ICON_SIZE} round/>
                    <span>X</span>
                </XShareButton>
                <button type="button" role="menuitem" tabIndex={-1} className="share-menu-item" onClick={copyLink}>
                    <span className="share-menu-item-icon" aria-hidden="true"><LinkIcon width="12px" height="12px"/></span>
                    <span>Copy link</span>
                </button>
                {hasNativeShare &&
                    <button type="button" role="menuitem" tabIndex={-1} className="share-menu-item" onClick={shareNatively}>
                        <span className="share-menu-item-icon" aria-hidden="true"><ShareIcon width="12px" height="12px"/></span>
                        <span>More…</span>
                    </button>}
            </div>,
            document.body,
        )}
    </>
}
