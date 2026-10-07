import { createSlice } from '@reduxjs/toolkit'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'
import { createCardReducers, createCardState } from './createCardSlice'

const slice = createSlice({
    name: 'test',
    initialState: createCardState(createIdInfo()),
    reducers: createCardReducers(createIdInfo, { maxSkills: 2 }),
})
const { actions, reducer } = slice
const initial = () => slice.getInitialState()

const withSkills = (...ids: string[]) =>
    createCardState(createIdInfo({ skillDetails: ids.map(inputId => createOffenseSkill({ inputId })) }))
const ids = (state: ReturnType<typeof initial>) => state.value.skillDetails.map(skill => skill.inputId)

describe('createCardReducers', () => {
    it('starts with loadId 0', () => {
        expect(initial().loadId).toBe(0)
    })

    it('loadInfo replaces the value and bumps loadId', () => {
        const info = createIdInfo({ title: 'Loaded' })
        const state = reducer(initial(), actions.loadInfo(info))
        expect(state.value.title).toBe('Loaded')
        expect(state.loadId).toBe(1)
    })

    it('setInfo replaces the value without bumping loadId', () => {
        const state = reducer(initial(), actions.setInfo(createIdInfo({ title: 'Typed' })))
        expect(state.value.title).toBe('Typed')
        expect(state.loadId).toBe(0)
    })

    it('resetInfo restores defaults and bumps loadId', () => {
        const dirty = reducer(initial(), actions.setInfo(createIdInfo({ title: 'Dirty' })))
        const state = reducer(dirty, actions.resetInfo())
        expect(state.value.title).toBe(createIdInfo().title)
        expect(state.loadId).toBe(1)
    })

    it('updateField changes a single field', () => {
        const state = reducer(initial(), actions.updateField('rarity', '/Images/rarity/3.webp'))
        expect(state.value.rarity).toBe('/Images/rarity/3.webp')
        expect(state.value.title).toBe(createIdInfo().title)
    })

    it('addSkill stops at maxSkills', () => {
        let state = withSkills()
        for (let i = 0; i < 3; i++) state = reducer(state, actions.addSkill(createPassiveSkill()))
        expect(state.value.skillDetails).toHaveLength(2)
    })

    it('updateSkill replaces the skill at an index', () => {
        const replacement = createPassiveSkill({ inputId: 'p' })
        const state = reducer(withSkills('a', 'b'), actions.updateSkill({ index: 1, skill: replacement }))
        expect(state.value.skillDetails[1]).toEqual(replacement)
    })

    it('deleteSkill removes by inputId', () => {
        expect(ids(reducer(withSkills('a', 'b'), actions.deleteSkill('a')))).toEqual(['b'])
    })

    it('deleteSkill ignores an unknown id', () => {
        expect(ids(reducer(withSkills('a', 'b'), actions.deleteSkill('z')))).toEqual(['a', 'b'])
    })

    it('moveSkill moves forward and backward', () => {
        const big = createSlice({
            name: 'big',
            initialState: createCardState(createIdInfo()),
            reducers: createCardReducers(createIdInfo, { maxSkills: 10 }),
        })
        const start = createCardState(createIdInfo({ skillDetails: ['a', 'b', 'c'].map(inputId => createOffenseSkill({ inputId })) }))
        const forward = big.reducer(start, big.actions.moveSkill({ fromId: 'a', toId: 'c' }))
        expect(forward.value.skillDetails.map(s => s.inputId)).toEqual(['b', 'c', 'a'])
        const backward = big.reducer(start, big.actions.moveSkill({ fromId: 'c', toId: 'a' }))
        expect(backward.value.skillDetails.map(s => s.inputId)).toEqual(['c', 'a', 'b'])
    })

    it('moveSkill leaves the list alone when an id is missing', () => {
        expect(ids(reducer(withSkills('a', 'b'), actions.moveSkill({ fromId: 'a', toId: 'z' })))).toEqual(['a', 'b'])
    })
})
