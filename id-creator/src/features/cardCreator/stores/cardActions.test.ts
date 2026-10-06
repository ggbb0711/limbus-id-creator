import { makeStore } from 'stores/AppStore'
import { cardSlice, loadCard, resetCard, setCard, updateBaseField } from './cardActions'
import { egoInfoSlice } from './EgoInfoSlice'
import { idInfoSlice } from './IdInfoSlice'

describe('cardActions', () => {
    it('picks the slice for a mode', () => {
        expect(cardSlice('id')).toBe(idInfoSlice)
        expect(cardSlice('ego')).toBe(egoInfoSlice)
    })

    it('loadCard migrates raw data into the right slice', () => {
        const store = makeStore()
        store.dispatch(loadCard('ego', { title: 'Ego', sinnerIcon: 'Images/a.png' }))
        expect(store.getState().egoInfo.value).toMatchObject({ title: 'Ego', sinnerIcon: '/Images/a.webp' })
        expect(store.getState().egoInfo.loadId).toBe(1)
        expect(store.getState().idInfo.loadId).toBe(0)
    })

    it('resetCard resets only its own slice', () => {
        const store = makeStore()
        store.dispatch(loadCard('id', { title: 'Id' }))
        store.dispatch(loadCard('ego', { title: 'Ego' }))
        store.dispatch(resetCard('id'))
        expect(store.getState().idInfo.value.title).toBe('')
        expect(store.getState().egoInfo.value.title).toBe('Ego')
    })
})

describe('setCard and updateBaseField', () => {
    it('setCard replaces the card without bumping loadId', () => {
        const store = makeStore()
        store.dispatch(setCard('ego', { ...store.getState().egoInfo.value, title: 'Typed' }))
        expect(store.getState().egoInfo.value.title).toBe('Typed')
        expect(store.getState().egoInfo.loadId).toBe(0)
    })

    it('updateBaseField writes a shared field on the right card', () => {
        const store = makeStore()
        store.dispatch(updateBaseField('id', 'sinnerColor', 'red'))
        expect(store.getState().idInfo.value.sinnerColor).toBe('red')
        expect(store.getState().egoInfo.value.sinnerColor).not.toBe('red')
    })
})
