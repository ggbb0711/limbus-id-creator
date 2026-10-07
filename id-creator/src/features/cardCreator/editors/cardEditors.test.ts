import { makeStore } from 'stores/AppStore'
import { appConfig } from 'config/env.client'
import { createSaveFile } from 'features/cardCreator/utils/save/createSaveFile'
import { createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { CARD_EDITORS, editorForSaveMode } from './cardEditors'
import { egoEditor } from './egoEditor'
import { idEditor } from './idEditor'

describe('card editor definitions', () => {
    it('registers each editor under its own kind', () => {
        expect(Object.entries(CARD_EDITORS).map(([kind, editor]) => [kind, editor.kind])).toEqual([['id', 'id'], ['ego', 'ego']])
    })

    it('describes what differs between the editors', () => {
        expect(idEditor).toMatchObject({
            label: 'Identity', saveMode: 'ID', iconPickerClass: 'sinner-icon', generalSectionTitle: 'Sinner General Info',
            uploadLimits: { sinnerIcon: appConfig.limits.upload.idSinnerIcon, splashArt: appConfig.limits.upload.idSplashArt },
        })
        expect(egoEditor).toMatchObject({
            label: 'E.G.O', saveMode: 'EGO', iconPickerClass: 'sinner-ego-icon', generalSectionTitle: 'Ego General Info',
            uploadLimits: { sinnerIcon: appConfig.limits.upload.egoSinnerIcon, splashArt: appConfig.limits.upload.egoSplashArt },
        })
        expect(idEditor.GeneralFields).toBeDefined()
        expect(egoEditor.GeneralFields).toBeUndefined()
    })

    it('finds the editor for a save mode', () => {
        expect(editorForSaveMode('ID')).toBe(idEditor)
        expect(editorForSaveMode('EGO')).toBe(egoEditor)
    })

    it('load migrates raw data into only its own card', () => {
        const store = makeStore()
        store.dispatch(egoEditor.load({ title: 'Ego', sinnerIcon: 'Images/a.png' }))
        expect(egoEditor.selectInfo(store.getState())).toMatchObject({ title: 'Ego', sinnerIcon: '/Images/a.webp' })
        expect(egoEditor.selectLoadId(store.getState())).toBe(1)
        expect(idEditor.selectLoadId(store.getState())).toBe(0)
    })

    it('reset and updateBaseField only touch their own card', () => {
        const store = makeStore()
        store.dispatch(idEditor.load({ title: 'Id' }))
        store.dispatch(egoEditor.load({ title: 'Ego' }))
        store.dispatch(idEditor.reset())
        store.dispatch(egoEditor.updateBaseField('sinnerColor', 'red'))
        expect(idEditor.selectInfo(store.getState()).title).toBe('')
        expect(egoEditor.selectInfo(store.getState())).toMatchObject({ title: 'Ego', sinnerColor: 'red' })
        expect(idEditor.selectInfo(store.getState()).sinnerColor).not.toBe('red')
    })

    it('setInfo replaces the card without bumping loadId', () => {
        const store = makeStore()
        store.dispatch(idEditor.setInfo(createIdInfo({ title: 'Typed' })))
        expect(idEditor.selectInfo(store.getState()).title).toBe('Typed')
        expect(idEditor.selectLoadId(store.getState())).toBe(0)
    })

    it('exposes the shared skill actions for its own slice', () => {
        const store = makeStore()
        store.dispatch(egoEditor.load({ skillDetails: [] }))
        store.dispatch(egoEditor.skillActions.addSkill(createOffenseSkill({ inputId: 'x' })))
        expect(egoEditor.selectInfo(store.getState()).skillDetails.map(s => s.inputId)).toEqual(['x'])
        expect(idEditor.selectInfo(store.getState()).skillDetails.some(s => s.inputId === 'x')).toBe(false)
    })

    it('migrate is used for saves of that editor', () => {
        const save = createSaveFile(createIdInfo({ title: 'Saved' }), 'name')
        expect(idEditor.migrate(save.saveInfo)).toMatchObject({ title: 'Saved', rarity: expect.any(String) })
        expect(egoEditor.migrate({})).toHaveProperty('sinCost')
    })
})
