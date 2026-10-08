'use client'
import { ReactElement, useState } from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "stores/AppStore";

const LoginMenu = dynamic(() => import("./LoginMenu"), { ssr: false })

export default function LoginMenuHost(): ReactElement | null {
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const [hasOpened, setHasOpened] = useState(isLoginMenuActive)

    if (isLoginMenuActive && !hasOpened) setHasOpened(true)

    return hasOpened ? <LoginMenu/> : null
}
