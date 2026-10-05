import Dexie, { EntityTable } from "dexie"
import { SaveMode } from "features/cardCreator/constants"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"

export type CurrentCardTable = EntityTable<CardInfo, "localSaveId">
export type LocalSavesTable = EntityTable<ISaveFile<CardInfo>, "id">

export const indexDB = new Dexie("LocalSaves") as Dexie & {
    currIdSave: CurrentCardTable
    IdLocalSaves: LocalSavesTable
    currEgoSave: CurrentCardTable
    EgoLocalSaves: LocalSavesTable
}

indexDB.version(1).stores({
    currIdSave: "++localSaveId",
    IdLocalSaves: "id",
    currEgoSave: "++localSaveId",
    EgoLocalSaves: "id",
})

export const CURRENT_CARD_KEY = 1

export const savesTable = (mode: SaveMode): LocalSavesTable => (mode === "ID" ? indexDB.IdLocalSaves : indexDB.EgoLocalSaves)

export const currentCardTable = (mode: SaveMode): CurrentCardTable => (mode === "ID" ? indexDB.currIdSave : indexDB.currEgoSave)
