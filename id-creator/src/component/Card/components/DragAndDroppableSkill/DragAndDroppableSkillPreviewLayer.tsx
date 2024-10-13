import CustomSinnerEffect from "component/Card/sections/CustomSinnerEffect/CustomSinnerEffect";
import DefenseSinnerSkill from "component/Card/sections/DefenseSinnerSkill/DefenseSinnerSkill";
import MentalSinnerEffect from "component/Card/sections/MentalSinnerEffect/MentalSinnerEffect";
import OffenseSinnerSkill from "component/Card/sections/OffenseSinnerSkill/OffenseSinnerSkill";
import PassiveSinnerSkill from "component/Card/sections/PassiveSinnerSkill/PassiveSinnerSkill";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import React, { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";


export default function DragAndDroppableSkillPreviewLayer(){
    const {
        item,
        isDragging,
        initialCursorOffset,
        initialFileOffset,
        currentFileOffset,
      } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        initialCursorOffset: monitor.getInitialClientOffset(),
        initialFileOffset: monitor.getInitialSourceClientOffset(),
        currentFileOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      }));
    
      if (!isDragging) {
        return null;
      }

      const printPreviewSkill = (skill: IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect)=>{
        const skillType = {
            OffenseSkill: <OffenseSinnerSkill offenseSkill={skill as IOffenseSkill} />,
            DefenseSkill: <DefenseSinnerSkill defenseSkill={skill as IDefenseSkill} />,
            PassiveSkill: <PassiveSinnerSkill passiveSkill={skill as IPassiveSkill} />,
            CustomEffect: <CustomSinnerEffect customEffect={skill as ICustomEffect} />,
            MentalEffect: <MentalSinnerEffect mentalEffect={skill as ICustomEffect} />
        }
        return skillType[skill.type]
      }
    
      return (
        <div style={layerStyles}>
          <div
            style={getItemStyles(
              initialCursorOffset,
              initialFileOffset,
              currentFileOffset
            )}
          >
            {printPreviewSkill(item.skill)}
          </div>
        </div>
      );
}

const layerStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
  };
  
  function getItemStyles(
    initialCursorOffset: XYCoord | null,
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null
  ) {
    if (!initialOffset || !currentOffset || !initialCursorOffset) {
      return {
        display: "none",
      };
    }
  
    const x = initialCursorOffset?.x + (currentOffset.x - initialOffset.x);
    const y = initialCursorOffset?.y + (currentOffset.y - initialOffset.y);
    const transform = `translate(${x}px, ${y}px) scale(0.7)`;
  
    return {
      transform,
      WebkitTransform: transform,
      background: "black",
      color: "white",
      opacity:0.85,
      ["font-family"]:`"Rubik", sans-serif`
    };
  }
  