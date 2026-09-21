import { IEgoInfo } from 'Features/CardCreator/Types/IEgoInfo';
import { IIdInfo } from 'Features/CardCreator/Types/IIdInfo';
import Dexie, { EntityTable } from 'dexie';
import { ISaveFile } from 'Types/ISaveFile';

interface LocalSaves {
    currIdSave: IIdInfo;
    IdLocalSaves: ISaveFile<IIdInfo>;
    currEgoSave: IIdInfo;
    EgoLocalSaves: ISaveFile<IEgoInfo>;
}

const indexDB = new Dexie("LocalSaves") as Dexie & {
    currIdSave: EntityTable<
        IIdInfo & { localSaveId?: number },
        'localSaveId'>,
    IdLocalSaves: EntityTable<ISaveFile<IIdInfo>, 'id'>,
    currEgoSave: EntityTable<
        IEgoInfo & { localSaveId?: number },
        'localSaveId'>,
    EgoLocalSaves: EntityTable<ISaveFile<IEgoInfo>, 'id'>
};

indexDB.version(1).stores({
    currIdSave: '++localSaveId',
    IdLocalSaves: 'id',
    currEgoSave: '++localSaveId',
    EgoLocalSaves: 'id'
})

function normalizeLocalSave<T>(raw: any): ISaveFile<T> {
    if (!raw) return raw
    return { ...raw, name: raw.name ?? raw.saveName ?? "Untitled" }
}

export type { LocalSaves };
export { indexDB, normalizeLocalSave };