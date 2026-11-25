'use client'
import React, { ReactElement, ReactNode } from "react"
import * as RadixContextMenu from "@radix-ui/react-context-menu"
import "components/ui/menu/Menu.css"
import { MenuChildrenProps, MenuItemProps, MenuParts, menuItemClassName } from "components/ui/menu/MenuParts"

function Item({ children, onSelect, disabled, danger }: MenuItemProps): ReactElement {
    return <RadixContextMenu.Item className={menuItemClassName(danger)} onSelect={onSelect} disabled={disabled}>
        {children}
    </RadixContextMenu.Item>
}

function Separator(): ReactElement {
    return <RadixContextMenu.Separator className="menu-separator"/>
}

function SubTrigger({ children }: MenuChildrenProps): ReactElement {
    return <RadixContextMenu.SubTrigger className="menu-item menu-sub-trigger">{children}</RadixContextMenu.SubTrigger>
}

function SubContent({ children }: MenuChildrenProps): ReactElement {
    return <RadixContextMenu.Portal>
        <RadixContextMenu.SubContent className="menu-content" sideOffset={4} collisionPadding={8}>
            {children}
        </RadixContextMenu.SubContent>
    </RadixContextMenu.Portal>
}

export const contextMenuParts: MenuParts = {
    Item,
    Separator,
    Sub: RadixContextMenu.Sub,
    SubTrigger,
    SubContent,
}

export default function ContextMenu({ trigger, children }: { trigger: ReactElement, children: ReactNode }): ReactElement {
    return <RadixContextMenu.Root>
        <RadixContextMenu.Trigger asChild>{trigger}</RadixContextMenu.Trigger>
        <RadixContextMenu.Portal>
            <RadixContextMenu.Content className="menu-content" collisionPadding={8}>
                {children}
            </RadixContextMenu.Content>
        </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
}
