import { ComponentType, ReactNode } from "react"

export interface MenuItemProps {
    children: ReactNode
    onSelect: () => void
    disabled?: boolean
    danger?: boolean
}

export interface MenuChildrenProps {
    children: ReactNode
}

export interface MenuParts {
    Item: ComponentType<MenuItemProps>
    Separator: ComponentType
    Sub: ComponentType<MenuChildrenProps>
    SubTrigger: ComponentType<MenuChildrenProps>
    SubContent: ComponentType<MenuChildrenProps>
}

export function menuItemClassName(danger?: boolean): string {
    return danger ? "menu-item danger" : "menu-item"
}
