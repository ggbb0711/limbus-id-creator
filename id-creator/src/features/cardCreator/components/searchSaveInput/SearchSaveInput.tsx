import React, { useRef, useState } from "react";
import { SaveMode } from "features/cardCreator/constants";
import { ReactElement } from "react";
import "./SearchSaveInput.css"
import { useCombobox } from "hooks/useCombobox";
import { useGetSaveListQuery } from "features/cardCreator/api/SaveInfoApi";
import formatDisplayDate from "utils/formatDisplayDate";

export default function SearchSaveInput({ userId, saveMode, chooseSave }: { userId: string, saveMode: SaveMode, chooseSave: (saveUrl: string) => void }): ReactElement {
    const [searchName, setSearchName] = useState("")

    const { data: saveList = [] } = useGetSaveListQuery(
        { userId, searchName, saveMode },
        { skip: !userId }
    )

    const containerRef = useRef<HTMLDivElement>(null)
    const combobox = useCombobox({
        containerRef,
        items: saveList,
        onSelect: (save) => {
            if (save.previewImg) chooseSave(save.previewImg)
            setSearchName("")
        },
    })

    return <div className="post-save-mode-input-container" ref={containerRef}>
        <input type="text" className="input post-save-input" placeholder="ID/EGO name" aria-label="Search your saves" value={searchName}
            {...combobox.inputProps}
            onChange={(e) => {
                setSearchName(e.target.value)
                combobox.open()
            }}
            autoComplete="off"/>
        <div className="post-save-found-outer-container">
            <div className="post-save-found-container" {...combobox.listProps}>
                {combobox.isOpen && saveList.map((save, i) =>
                    <div key={save.id} className={`center-element post-save-found-tab ${combobox.activeIndex === i ? "active" : ""}`} {...combobox.getOptionProps(i)}>
                        <img src={save.previewImg} className="search-save-preview-img" alt="" />
                        <div>
                            <p>Updated: {formatDisplayDate(save.saveTime, { withTime: true })}</p>
                            <p>{save.name}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
}
