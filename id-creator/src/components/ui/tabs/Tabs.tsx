'use client'
import React, { ReactElement, ReactNode, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import "./Tabs.css";

export interface Tab {
    id: string
    label: string
    panel: ReactNode
}

export default function Tabs({ tabs, label, className = "" }: { tabs: Tab[], label: string, className?: string }): ReactElement {
    const [value, setValue] = useState(tabs[0]?.id ?? "")

    return <RadixTabs.Root className={`tabs ${className}`.trim()} value={value} onValueChange={setValue}>
        <RadixTabs.List className="tabs-list" aria-label={label}>
            {tabs.map(tab => <RadixTabs.Trigger key={tab.id} value={tab.id} className="tabs-trigger">
                {tab.label}
            </RadixTabs.Trigger>)}
        </RadixTabs.List>
        {tabs.map(tab => <RadixTabs.Content key={tab.id} value={tab.id} className="tabs-panel" forceMount hidden={tab.id !== value}>
            {tab.panel}
        </RadixTabs.Content>)}
    </RadixTabs.Root>
}
