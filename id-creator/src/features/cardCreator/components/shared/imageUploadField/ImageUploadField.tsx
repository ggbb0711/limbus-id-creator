import React, { ReactElement, useState } from "react"
import { filesize } from "filesize"
import DeleteIcon from "assets/icons/DeleteIcon"
import useAlert from "hooks/useAlert"
import { reportError } from "utils/reportError"
import UploadImgBtn from "features/cardCreator/components/inputTab/components/uploadImgBtn/UploadImgBtn"
import { compressAndReadImage } from "features/cardCreator/utils/image/CompressAndReadImage"

interface ImageUploadFieldProps {
    id: string
    buttonText: string
    maxSize: number
    value?: string
    onChange: (url: string) => void
    previewClassName?: string
}

export default function ImageUploadField({ id, buttonText, maxSize, value, onChange, previewClassName }: ImageUploadFieldProps): ReactElement {
    const { addAlert } = useAlert()
    const [isProcessing, setIsProcessing] = useState(false)

    async function handleFile(file: File) {
        setIsProcessing(true)
        try {
            onChange(await compressAndReadImage(file))
        } catch (error) {
            reportError(error, { context: "imageUpload", extra: { id } })
            addAlert("Failure", "Could not read that image")
        } finally {
            setIsProcessing(false)
        }
    }

    return <>
        {previewClassName && value &&
            <div className="input-group-container">
                <div className="input-container center-element">
                    <img className={previewClassName} src={value} alt={`${id}-preview`} />
                    <button className="main-button" onClick={() => onChange("")}>
                        <p className="center-element delete-txt"><DeleteIcon/> Delete</p>
                    </button>
                </div>
            </div>
        }
        <UploadImgBtn name={id} id={id} disabled={isProcessing} onFile={handleFile} maxSize={maxSize}
            btnTxt={isProcessing ? "Processing..." : `${buttonText} (<= ${filesize(maxSize)})`}/>
    </>
}
