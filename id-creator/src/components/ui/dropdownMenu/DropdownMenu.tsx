'use client'
import React, { ReactElement, ReactNode } from "react"
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu"
import "components/ui/menu/Menu.css"
import { MenuChildrenProps, MenuItemProps, MenuParts, menuItemClassName } from "components/ui/menu/MenuParts"

function Item({ children, onSelect, disabled, danger }: MenuItemProps): ReactElement {
    return <RadixDropdownMenu.Item className={menuItemClassName(danger)} onSelect={onSelect} disabled={disabled}>
        {children}
    </RadixDropdownMenu.Item>
}

function Separator(): ReactElement {
    return <RadixDropdownMenu.Separator className="menu-separator"/>
}

function SubTrigger({ children }: MenuChildrenProps): ReactElement {
    return <RadixDropdownMenu.SubTrigger className="menu-item menu-sub-trigger">{children}</RadixDropdownMenu.SubTrigger>
}

function SubContent({ children }: MenuChildrenProps): ReactElement {
    return <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.SubContent className="menu-content" sideOffset={4} collisionPadding={8}>
            {children}
        </RadixDropdownMenu.SubContent>
    </RadixDropdownMenu.Portal>
}

export const dropdownMenuParts: MenuParts = {
    Item,
    Separator,
    Sub: RadixDropdownMenu.Sub,
    SubTrigger,
    SubContent,
}

export default function DropdownMenu({ trigger, children }: { trigger: ReactElement, children: ReactNode }): ReactElement {
    return <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Portal>
            <RadixDropdownMenu.Content className="menu-content" align="end" sideOffset={4} collisionPadding={8}>
                {children}
            </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
}
