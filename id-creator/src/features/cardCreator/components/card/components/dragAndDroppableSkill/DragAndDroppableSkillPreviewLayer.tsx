
import React, { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import SkillCardSection from "../skillCardSection/SkillCardSection";
import { DndItemType } from "features/cardCreator/constants";
import { getSkillData } from "features/cardCreator/skills/skillData";
import { SkillDetail, isActiveSkill } from "features/cardCreator/types/SkillDetail";


export default function DragAndDroppableSkillPreviewLayer(){
    const {
        item,
        itemType,
        isDragging,
        initialCursorOffset,
        initialFileOffset,
        currentFileOffset,
      } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialCursorOffset: monitor.getInitialClientOffset(),
        initialFileOffset: monitor.getInitialSourceClientOffset(),
        currentFileOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      }));
    
      if (!isDragging) {
        return null;
      }

      if (itemType === DndItemType.SkillTab) {
        const skillData = getSkillData(item.skill.type)
        return (
          <div style={layerStyles}>
            <div className="input-tab-side drag-preview" style={getTabStyles(currentFileOffset, item.skill)}>
              <img src={skillData.tabIcon(item.skill)} alt={skillData.tabLabel} crossOrigin="anonymous"/>
            </div>
          </div>
        );
      }

      if (itemType !== DndItemType.CardSkill) {
        return null;
      }

      return (
        <div style={layerStyles}>
          <div
            style={getItemStyles(
              initialCursorOffset,
              initialFileOffset,
              currentFileOffset,
              item.skillWidth,
              item.skillHeight
            )}
          >
            <SkillCardSection skill={item.skill}/>
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
  
  function getTabStyles(currentOffset: XYCoord | null, skill: SkillDetail): CSSProperties {
    if (!currentOffset) {
      return { display: "none" };
    }
    return {
      transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      background: `var(--${isActiveSkill(skill) ? skill.skillAffinity : "None"}-input-page)`,
      opacity: 0.85,
    };
  }

  function getItemStyles(
    initialCursorOffset: XYCoord | null,
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    width:number,
    height:number
  ) {
    if (!initialOffset || !currentOffset || !initialCursorOffset) {
      return {
        display: "none",
      };
    }

    const scale = 0.5;

    const centerX = (width / 2) * scale;
    const centerY = (height / 2) * scale;
  
    const x = initialCursorOffset?.x + (currentOffset.x - initialOffset.x) - centerX
    const y = initialCursorOffset?.y + (currentOffset.y - initialOffset.y) - centerY
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    const skillWidth = width===0? 'auto':width+"px"
    const skillHeight = height===0? 'auto':height+"px"
  
    return {
      transform,
      WebkitTransform: transform,
      background: "black",
      color: "white",
      opacity:0.85,
      width: skillWidth,
      height: skillHeight,
      fontFamily:`var(--font-rubik), sans-serif`
    };
  }
  