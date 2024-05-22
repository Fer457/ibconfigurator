import React from 'react';

interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const Arrow: React.FC<ArrowProps> = ({ startX, startY, endX, endY }) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  return (
    <svg
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        pointerEvents: 'none',
        overflow: 'visible'
      }}
      width={length}
      height={length}
    >
      <line
        x1="0"
        y1="0"
        x2={length}
        y2="0"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        transform={`rotate(${angle})`}
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="8"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>
  );
};

export default Arrow;
