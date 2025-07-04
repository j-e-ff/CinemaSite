import React from 'react'

const RADIUS = 18;
const STROKE = 2;
const CIRCUMFERENCE = 2 * Math.pi * RADIUS;

function CircularIndicator({value}){
    const progress = Math.min(Math.max(value,0),100);
    const offset = CIRCUMFERENCE - (progress/100);
  return (
    <svg width={44} height={44} className="circular-progress">
      <circle
        cx="22"
        cy="22"
        r={RADIUS}
        stroke="#eee"
        strokeWidth={STROKE}
        fill="none"
      />
      <circle
        cx="22"
        cy="22"
        r={RADIUS}
        stroke="#4caf50"
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="14"
        fill="#333"
      >
        {value}
      </text>
    </svg>
  );
}

export default CircularIndicator;