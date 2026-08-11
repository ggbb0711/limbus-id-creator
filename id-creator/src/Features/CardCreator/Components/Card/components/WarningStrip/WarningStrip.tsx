import React, { useId } from "react";

export default function WarningStrip({color, className = ''}:{color:string, className?: string}){
  const patternId = useId(); 

  return (
    <svg width="100%" height={20} style={{ display: 'block' }} className={className}>
      <defs>
        <pattern id={patternId} width="70" height={20} patternUnits="userSpaceOnUse">
          <rect width="70" height={20} fill="#000000" />
          <text x="6" y={20 - 7} fill={color}
                fontFamily="monospace" fontWeight={700} fontSize="11">
            WARNING ////
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}