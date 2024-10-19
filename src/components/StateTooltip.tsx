import React from "react";

interface StateTooltipProps {
  stateName: string;
  engagementCount: number;
}

const StateTooltip: React.FC<StateTooltipProps> = ({
  stateName,
  engagementCount,
}) => {
  return (
    <g>
      <rect
        x="-60"
        y="-45"
        width="120"
        height="50"
        rx="5"
        ry="5"
        fill="rgba(255, 255, 255, 0.9)"
        stroke="#ccc"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <text
        textAnchor="middle"
        style={{
          fontFamily: "system-ui",
          fill: "#5D5A6D",
          fontSize: "12px",
        }}
      >
        <tspan x="0" dy="-20">{stateName}</tspan>
        <tspan x="0" dy="20">Engagements: {engagementCount}</tspan>
      </text>
    </g>
  );
};

export default StateTooltip;
