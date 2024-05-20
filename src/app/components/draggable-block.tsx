/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableBlockProps {
  id: number;
  type: string;
  data: string;
  position: Position;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  isDropped: boolean;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ id, type, data, position, onDragStart, isDropped }) => {
  const { x, y } = position;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      style={{
        position: isDropped ? 'absolute' : 'static',
        left: isDropped ? `${x}px` : 'auto',
        top: isDropped ? `${y}px` : 'auto',
        border: '1px solid #000',
        padding: '10px',
        cursor: 'grab',
        backgroundColor: isDropped ? '#fff' : '#f0f0f0',
        margin: isDropped ? '0' : '10px 0'
      }}
    >
      {type === 'text' && <div>{data}</div>}
      {type === 'image' && <img src={data} alt="Block" style={{ maxWidth: '100%' }} />}
      {type === 'button' && <button>{data}</button>}
    </div>
  );
};

export default DraggableBlock;
