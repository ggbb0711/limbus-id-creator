'use client'
import React, { ReactNode, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './AppStore'

export default function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState(makeStore)
    return <Provider store={store}>{children}</Provider>
}
