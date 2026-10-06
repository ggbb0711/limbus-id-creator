export interface NavLink {
    href: string
    label: string
}

export const NAV_LINKS: readonly NavLink[] = [
    { href: "/creator/identity", label: "Create Id" },
    { href: "/creator/ego", label: "Create Ego" },
    { href: "/forum", label: "Forum" },
]
