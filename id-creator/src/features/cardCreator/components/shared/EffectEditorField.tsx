import React, { ReactElement } from "react"
import TipTapEditor from "features/cardCreator/components/inputTab/components/tipTapEditor/TipTapEditor"

export type EffectGuide = "skill" | "basic"

const SinkingExample = () =>
    <span contentEditable={false} style={{ color: "var(--Debuff-color)", textDecoration: "underline" }}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>

const CoinExample = () =>
    <span contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>

const HeadsHitExample = () =>
    <span contentEditable={false} style={{ color: '#c7ff94' }}>[Heads Hit]</span>

const GUIDES: Record<EffectGuide, ReactElement> = {
    skill: <p className="effect-guide">To enter a status effect/coin effect/special coin(Unbreakable coin)/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[coin_1_unbreakable]/[heads_hit] -{">"}
        <SinkingExample/>/
        <CoinExample/>/
        <span contentEditable={false} className='center-element'><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' data-custom-coin-effect='coin-effect-1-unbreakable' /> <span contentEditable={false} className='center-element' style={{ color: "var(--Neutral-color)", textDecoration: "underline" }}><img className='status-icon' src='/Images/Unbreakable_Coin.webp' alt='unbreakable_coin_icon' />Unbreakable Coin</span></span>
        <HeadsHitExample/>
    </p>,
    basic: <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"}
        <SinkingExample/>/
        <CoinExample/>/
        <HeadsHitExample/>
    </p>,
}

interface EffectEditorFieldProps {
    label: string
    inputId: string
    content: string
    onChange: (html: string) => void
    matchList: { [key: string]: string }
    guide?: EffectGuide
}

export default function EffectEditorField({ label, inputId, content, onChange, matchList, guide = "basic" }: EffectEditorFieldProps): ReactElement {
    return <div className="input-group-container">
        <div className="input-container">
            <label className="input-label" htmlFor={inputId}>{label}</label>
            {GUIDES[guide]}
            <TipTapEditor inputId={inputId} content={content} changeHandler={onChange} matchList={matchList}/>
        </div>
    </div>
}
