import React, { forwardRef } from "react";
import { ReactElement } from "react";
import "../SinnerSkill.css"
import { IOffenseSkill } from "features/cardCreator/types/skills/offenseSkill/IOffenseSkill";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import { CoinEffect, getCoinEffect } from "features/cardCreator/utils/getCoinEffect";
import { assetPaths } from "utils/assetPaths";

const OffenseSkillSplash = ({skillAffinity,skillImage,skillFrame}:{skillAffinity:string,skillImage?:string,skillFrame:string}):ReactElement =>{
    const frameSrc = assetPaths.skillFrame(skillAffinity, skillFrame)
    return(
        <div className="skill-splash">
            <img src={frameSrc} alt={skillAffinity+"Frame"} className={`sin-frame ${skillAffinity==="None"?"none-affinity":""}`} />
            <div className="splash-container" style={{'backgroundColor':`var(--${skillAffinity})`}}>
                {
                (skillImage)?
                    <img className="skill-image" src={skillImage} alt="skill image" crossOrigin="anonymous" />:
                    (skillAffinity!=="None")?<img className={`placeholder-skill`} src={assetPaths.affinityBig(skillAffinity)} alt="skill affinity" />:<></>
                }
            </div>
        </div>
    )
}

const OffenseSinnerSkill = forwardRef<HTMLDivElement, { offenseSkill: IOffenseSkill }>(({ offenseSkill }, ref) => {
    const {
        damageType,
        name,
        skillAffinity,
        basePower,
        coinNo,
        coinPow,
        skillImage,
        skillEffect,
        skillLabel,
        skillLevel,
        skillAmt,
        atkWeight,
        skillFrame,
    } = offenseSkill;

    const renderCoin = (coinEffect: CoinEffect, key: number): ReactElement => {
        switch (coinEffect.type) {
            case "unbreakable":
                return <img key={key} src={assetPaths.coin.unbreakable} alt="unbreakable_coin_icon" />;
            case "excision":
                return <img key={key} src={assetPaths.coin.excision} alt="excision_coin_icon" />;
            case "custom":
                return coinEffect.imageSrc
                    ? <img key={key} className="custom-coin-icon" src={coinEffect.imageSrc} alt={`${coinEffect.name}_coin_icon`} crossOrigin="anonymous" />
                    : <span key={key} className="custom-coin-fallback" style={{ color: coinEffect.color }} title={coinEffect.name}>{coinEffect.name[0] ?? "?"}</span>;
            default:
                return <img key={key} src={assetPaths.coin.normal} alt="coin_icon" />;
        }
    }

    const printCoins = function (coinNo: number,skillEffect:string): (ReactElement | never)[] {
        if (coinNo > 10) return [<img key={0} src={assetPaths.coin.normal} alt="coin_icon" />];

        const arr = [];

        for (let i = 0; i < coinNo; i++) {
            arr.push(renderCoin(getCoinEffect(skillEffect, i + 1), i));
        }
        return arr;
    }

    return (
        <div className="skill-section-container active-skill-container" ref={ref}>
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <OffenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage} skillFrame={skillFrame} />
                        <div className="skill-power">
                            {basePower}
                            <img className="damage-type" src={`/Images/attack/attackt_${damageType}.webp`} alt="" />
                            {(coinPow < 0 ? "" : "+") + coinPow}
                        </div>
                        <div className="skill-level">
                            <img src={"/Images/stat/stat_attack.webp"} className="skill-level-icon" alt="attack_icon" />
                            <div>
                                <p>Id level</p>
                                <p>{skillLevel < 0 ? skillLevel : "+" + skillLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity==="None"?<></>:<img className={`sinner-skill-affinity-icon ${skillAffinity}`} src={assetPaths.affinityBig(skillAffinity)} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo,skillEffect)}
                                {coinNo > 10 ? `x ${coinNo}` : ""}
                            </div>
                            <div className="active-skill-title-container">
                                <div className="active-skill-title">
                                    <SkillTitle skillAffinity={skillAffinity} skillTitle={name} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="skill-description">
                        <div className="atk-weight-skill-label-section">
                            <div className="attack-weight">
                                <p>Atk Weight: {atkWeight}</p>
                            </div>
                        </div>
                        <div>
                            <p><span className="skill-amount">Amt.</span> x{skillAmt}</p>
                        </div>
                        <SkillEffect effect={skillEffect} />
                    </div>
                </div>
            </div>
        </div>
    );
});
OffenseSinnerSkill.displayName = "OffenseSinnerSkill"
export default OffenseSinnerSkill;
