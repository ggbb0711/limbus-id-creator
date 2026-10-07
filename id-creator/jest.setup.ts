import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia',{
    writable: true,
    value: (query:string)=>({
        matches: false, 
        media: query,
        onchange: null,
        addEventListener: ()=>{},
        removeEventListener: ()=>{},
        addListener: ()=>{},
        removeListener: ()=>{},
        dispatchEvent:()=>false
    })
})
if (typeof globalThis.structuredClone !== 'function') {
    const { serialize, deserialize } = jest.requireActual<typeof import('v8')>('v8')
    globalThis.structuredClone = <T,>(value: T): T => deserialize(serialize(value))
}
