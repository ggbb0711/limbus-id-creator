import React, { forwardRef } from "react";
import { ReactElement } from "react";
import "../SinnerSkill.css";
import "./DefenseSinnerSkill.css";
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import SkillTitle from "../../components/skillTitle/SkillTitle";
import SkillEffect from "../../components/skillEffect/SkillEffect";
import { CoinEffect, MAX_DRAWN_COINS, getCoinEffects } from "features/cardCreator/utils/card/getCoinEffect";
import { getSkillLevelIcon, getSkillPowerIcon } from "features/cardCreator/utils/card/skillIcons";
import formatSigned from "features/cardCreator/utils/card/formatSigned";
import { assetPaths } from "features/cardCreator/utils/card/assetPaths";

const DefenseSkillSplash = ({skillAffinity,skillImage,defenseType,skillFrame,showDefenseIcon}:{skillAffinity:string,skillImage?:string,defenseType:string,skillFrame:string,showDefenseIcon:boolean}):ReactElement => {
    const frameSrc = assetPaths.skillFrame(skillAffinity, skillFrame)
    return(
        <div className="skill-splash">
            <img src={frameSrc} alt={skillAffinity+"Frame"} className={`sin-frame ${skillAffinity==="None"?"none-affinity":""}`} />
            <div className="splash-container" style={{'backgroundColor':`var(--${skillAffinity})`}}>
                {showDefenseIcon &&
                    <div className="defense-icon-container">
                        <img src={`/Images/defense/defense_${defenseType}.webp`} alt={`defense_${defenseType}`} />
                    </div>
                }
                { skillImage && <img className="skill-image" src={skillImage} alt="skill image" crossOrigin="anonymous" />}
            </div>
        </div>
    )
}

const DefenseSinnerSkill = forwardRef<HTMLDivElement, { defenseSkill: IDefenseSkill }>(({ defenseSkill }, ref) => {
    const {
        defenseType,
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
        showDefenseIcon,
    } = defenseSkill;
    const powerIcon = getSkillPowerIcon(defenseSkill)
    const levelIcon = getSkillLevelIcon(defenseSkill)

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

    const printCoins = (coinNo: number, skillEffect: string): ReactElement[] =>
        getCoinEffects(skillEffect, coinNo).map((effect, i) => renderCoin(effect, i))

    return (
        <div ref={ref} className="skill-section-container active-skill-container">
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <DefenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage} defenseType={defenseType} skillFrame={skillFrame} showDefenseIcon={showDefenseIcon} />
                        <div className="skill-power">
                            {basePower}
                            <img className="damage-type" src={powerIcon.src} alt={powerIcon.alt} />
                            {formatSigned(coinPow)}
                        </div>
                        <div className="skill-level">
                            <img src={levelIcon.src} className="skill-level-icon" alt={levelIcon.alt} />

                            <div>
                                <p>Id level</p>
                                <p>{formatSigned(skillLevel)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity === "None"?<></>:<img className={`sinner-skill-affinity-icon`} src={assetPaths.affinityBig(skillAffinity)} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo,skillEffect)}
                                {coinNo > MAX_DRAWN_COINS ? `x ${coinNo}` : ""}
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
DefenseSinnerSkill.displayName = "DefenseSinnerSkill";
export default DefenseSinnerSkill;
