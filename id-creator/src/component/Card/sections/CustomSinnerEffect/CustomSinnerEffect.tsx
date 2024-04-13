import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import React, { forwardRef, ReactElement } from "react";
import "../SinnerSkill.css"
import "./CustomSinnerEffect.css"
import SkillEffect from "component/Card/components/SkillEffect/SkillEffect";

const CustomSinnerEffect = forwardRef<HTMLDivElement, { customEffect: ICustomEffect }>(({ customEffect }, ref) => {
    const {
        name,
        customImg,
        effectColor,
        effect,
    } = customEffect;

    return (
        <div ref={ref} className="skill-section-container custom-effect-container">
            <div className="skill-section">
                <div>
                    <div style={{ color: effectColor }} className="cutom-effect-header">
                        {customImg && <img className={`custom-img`} src={customImg} alt="custom_icon" />}
                        <p className="custom-effect-title">{name}</p>
                    </div>
                    <div>
                        <SkillEffect effect={effect} />
                    </div>
                </div>

            </div>
        </div>
    );
});

export default CustomSinnerEffect;