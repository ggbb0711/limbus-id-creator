import React from "react";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import "./ResetMenu.css"
import CheckIcon from "assets/icons/CheckIcon";
import CloseIcon from "assets/icons/CloseIcon";

export default function ResetMenu({ isActive, setIsActive, confirmFn }: { isActive: boolean, setIsActive: (isActive: boolean) => void, confirmFn: () => void }) {
    const close = () => setIsActive(false)

    return <PopUpMenu open={isActive} label="Reset progress" onClose={close}>
        <div className="reset-menu">
            <h1>Do you want to reset your progess</h1>
            <div className="center-element">
                <button type="button" className="main-button center-element" onClick={() => {
                    confirmFn()
                    close()
                }}>
                    <CheckIcon/>
                    <p>Confirm</p>
                </button>
                <button type="button" className="main-button center-element" onClick={close}>
                    <CloseIcon/>
                    <p>Cancel</p>
                </button>
            </div>
        </div>
    </PopUpMenu>
}
