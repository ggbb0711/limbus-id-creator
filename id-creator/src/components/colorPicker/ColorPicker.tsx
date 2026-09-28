import React, { ReactElement, useEffect, useRef } from "react";
import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";
import namesPlugin from "colord/plugins/names";
import "@melloware/coloris/dist/coloris.css"
import "./ColorPicker.css"
import { ColorPreset, ColorPresetGroup } from "./ColorPresets";

extend([labPlugin,namesPlugin])

const SAVED_COLORS_KEY = "savedColors"
const MAX_SAVED_COLORS = 12
const NO_PRESETS:ColorPresetGroup[] = []

type ColorisModule = typeof import("@melloware/coloris")

let coloris:ColorisModule|null = null
let colorisSetup:Promise<ColorisModule>|null = null
let activeInput:HTMLInputElement|null = null
let activePresets:ColorPresetGroup[] = NO_PRESETS

function loadSavedColors():string[]{
    try{
        const saved = JSON.parse(localStorage.getItem(SAVED_COLORS_KEY) ?? "[]")
        return Array.isArray(saved) ? saved.filter((color):color is string=>typeof color==="string") : []
    }catch{
        return []
    }
}

function storeSavedColors(savedColors:string[]){
    try{
        localStorage.setItem(SAVED_COLORS_KEY,JSON.stringify(savedColors))
    }catch{
        return
    }
}

function normalizeColor(text:string):string|null{
    const color = text.trim()
    if(!color) return null
    if(CSS.supports("color",color)) return color
    if(CSS.supports("color","#"+color)) return "#"+color
    return null
}

function resolvePresets(presets:ColorPreset[]){
    const rootStyle = getComputedStyle(document.documentElement)
    return presets
        .map(preset=>({label:preset.label,color:rootStyle.getPropertyValue(preset.cssVar).trim()}))
        .filter(preset=>preset.color)
}

const COLOR_DELTA_TOLERANCE = 0.01
const ALPHA_TOLERANCE = 0.011

function isSameColor(a:string,b:string){
    const first = colord(a)
    const second = colord(b)
    if(!first.isValid() || !second.isValid()) return a.toLowerCase()===b.toLowerCase()
    return first.delta(second)<=COLOR_DELTA_TOLERANCE
        && Math.abs(first.alpha()-second.alpha())<=ALPHA_TOLERANCE
}

function getActiveColor(){
    return activeInput ? normalizeColor(activeInput.value) : null
}

function updateActionButtons(){
    const savedColors = loadSavedColors()
    const removeButton = document.getElementById("clr-remove") as HTMLButtonElement|null
    const clearButton = document.getElementById("clr-clear-saved") as HTMLButtonElement|null
    const color = getActiveColor()
    if(removeButton) removeButton.disabled = !color || !savedColors.some(saved=>isSameColor(saved,color))
    if(clearButton) clearButton.disabled = savedColors.length===0
}

interface SwatchSection {
    title:string,
    swatches:{label:string,color:string}[],
    emptyText?:string
}

function createSwatchSection(section:SwatchSection,buttons:HTMLElement[]){
    const group = document.createElement("div")
    group.className = "clr-swatch-group"
    const title = document.createElement("h3")
    title.className = "clr-swatch-title"
    title.textContent = section.title
    group.append(title)
    if(buttons.length===0 && section.emptyText){
        const empty = document.createElement("p")
        empty.className = "clr-swatch-empty"
        empty.textContent = section.emptyText
        group.append(empty)
        return group
    }
    const row = document.createElement("div")
    row.className = "clr-swatch-row"
    buttons.forEach((button,i)=>{
        button.title = section.swatches[i].label
        row.append(button)
    })
    group.append(row)
    return group
}

function groupSwatches(sections:SwatchSection[]){
    const swatchesContainer = document.getElementById("clr-swatches")
    if(!swatchesContainer) return
    const buttons = Array.from(swatchesContainer.querySelectorAll<HTMLElement>("button"))
    swatchesContainer.textContent = ""
    let index = 0
    sections.forEach(section=>{
        const sectionButtons = buttons.slice(index,index+section.swatches.length)
        index += section.swatches.length
        swatchesContainer.append(createSwatchSection(section,sectionButtons))
    })
}

function updateSwatches(){
    if(!coloris) return
    const presetSections:SwatchSection[] = activePresets
        .map(group=>({title:group.title,swatches:resolvePresets(group.presets)}))
        .filter(section=>section.swatches.length>0)
    const presetColors = presetSections.flatMap(section=>section.swatches.map(swatch=>swatch.color))
    const customSection:SwatchSection = {
        title:"Custom",
        swatches:loadSavedColors()
            .filter(color=>!presetColors.some(presetColor=>isSameColor(presetColor,color)))
            .map(color=>({label:`Saved: ${color}`,color})),
        emptyText:"No saved colors yet",
    }
    const sections = [...presetSections,customSection]
    coloris({swatches:sections.flatMap(section=>section.swatches.map(swatch=>swatch.color))} as Parameters<ColorisModule>[0])
    groupSwatches(sections)
    updateActionButtons()
    coloris.updatePosition()
}

function saveActiveColor(){
    const color = getActiveColor()
    if(!color) return
    storeSavedColors([color,...loadSavedColors().filter(saved=>!isSameColor(saved,color))].slice(0,MAX_SAVED_COLORS))
    updateSwatches()
}

function removeActiveColor(){
    const color = getActiveColor()
    if(!color) return
    storeSavedColors(loadSavedColors().filter(saved=>!isSameColor(saved,color)))
    updateSwatches()
}

function clearSavedColors(){
    storeSavedColors([])
    updateSwatches()
}

function createActionButton(id:string,label:string,onClick:()=>void){
    const button = document.createElement("button")
    button.type = "button"
    button.id = id
    button.className = "clr-action"
    button.textContent = label
    button.addEventListener("click",onClick)
    return button
}

function addActionButtons(){
    const swatchesContainer = document.getElementById("clr-swatches")
    if(!swatchesContainer || document.getElementById("clr-actions")) return
    const actions = document.createElement("div")
    actions.id = "clr-actions"
    actions.className = "clr-actions"
    actions.append(
        createActionButton("clr-save","Save color",saveActiveColor),
        createActionButton("clr-remove","Remove",removeActiveColor),
        createActionButton("clr-clear-saved","Clear all",clearSavedColors),
    )
    swatchesContainer.before(actions)
}

function arrangePickerLayout(){
    const picker = document.getElementById("clr-picker")
    const colorArea = document.getElementById("clr-color-area")
    const preview = document.getElementById("clr-color-preview")
    const closeButton = document.getElementById("clr-close")
    if(!picker || !colorArea || !preview || !closeButton || document.getElementById("clr-scroll-body")) return

    const header = document.createElement("div")
    header.id = "clr-header"
    header.className = "clr-header"
    header.append(preview,closeButton)

    const scrollBody = document.createElement("div")
    scrollBody.id = "clr-scroll-body"
    scrollBody.className = "clr-scroll-body"
    const scrollableSelectors = [".clr-hue",".clr-alpha","#clr-color-value","#clr-format","#clr-swatches","#clr-clear"]
    scrollableSelectors.forEach(selector=>{
        const element = picker.querySelector(selector)
        if(element) scrollBody.append(element)
    })

    picker.prepend(header)
    colorArea.after(scrollBody)
}

function getPickerContainer(){
    const existing = document.getElementById("clr-container")
    if(existing) return existing
    const container = document.createElement("div")
    container.id = "clr-container"
    container.className = "clr-container"
    document.body.appendChild(container)
    return container
}

function setupColoris(){
    colorisSetup ??= import("@melloware/coloris").then(({default:Coloris})=>{
        Coloris.init()
        Coloris({
            el: ".coloris-input",
            parent: getPickerContainer(),
            wrap: false,
            themeMode: "dark",
            format: "auto",
            formatToggle: true,
            alpha: true,
            closeButton: true,
        })
        coloris = Coloris
        document.addEventListener("scroll",()=>Coloris.updatePosition(),true)
        arrangePickerLayout()
        addActionButtons()
        updateSwatches()
        return Coloris
    })
    return colorisSetup
}

export default function ColorPicker({value,onChange,id,className,title,presets=NO_PRESETS}:{value:string,onChange:(color:string)=>void,id?:string,className?:string,title?:string,presets?:ColorPresetGroup[]}):ReactElement{
    const inputRef = useRef<HTMLInputElement>(null)
    const onChangeRef = useRef(onChange)
    const presetsRef = useRef(presets)

    useEffect(()=>{
        onChangeRef.current = onChange
        presetsRef.current = presets
    },[onChange,presets])

    useEffect(()=>{
        setupColoris()
    },[])

    useEffect(()=>{
        const input = inputRef.current
        if(!input) return
        const handleInput = ()=>{
            const color = normalizeColor(input.value)
            if(color) onChangeRef.current(color)
            if(activeInput===input) updateActionButtons()
        }
        const handleOpen = ()=>{
            activeInput = input
            activePresets = presetsRef.current
            updateSwatches()
        }
        input.addEventListener("input",handleInput)
        input.addEventListener("click",handleOpen)
        return ()=>{
            input.removeEventListener("input",handleInput)
            input.removeEventListener("click",handleOpen)
            if(activeInput===input) activeInput = null
        }
    },[])

    useEffect(()=>{
        const input = inputRef.current
        if(input && document.activeElement!==input && input.value!==(value ?? "")) input.value = value ?? ""
    },[value])

    return <div className={`clr-field color-picker ${className ?? ""}`} style={{color:value}} title={title}>
        <button type="button" aria-label={title ?? "Pick a color"}/>
        <input ref={inputRef} id={id} className="coloris-input color-picker-input" type="text"
            defaultValue={value} placeholder="color" spellCheck={false} autoComplete="off"/>
    </div>
}
