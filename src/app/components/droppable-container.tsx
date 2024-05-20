"use client"

import React, { useState } from 'react';
import DraggableBlock from './draggable-block';

interface Position {
  x: number;
  y: number;
}

interface Block {
  id: number;
  type: string;
  data: string;
  position: Position;
  isDropped: boolean;
}

const DroppableContainer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'text', data: 'Sample Text', position: { x: 10, y: 10 }, isDropped: false },
    { id: 2, type: 'image', data: 'https://via.placeholder.com/150', position: { x: 10, y: 100 }, isDropped: false },
    { id: 3, type: 'button', data: 'Click Me', position: { x: 10, y: 200 }, isDropped: false }
  ]);

  const [droppedBlocks, setDroppedBlocks] = useState<Block[]>([]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('blockId', id.toString());
    const isDropped = droppedBlocks.some(block => block.id === id);
    e.dataTransfer.setData('isDropped', isDropped.toString());
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = parseInt(e.dataTransfer.getData('blockId'));
    const isDropped = e.dataTransfer.getData('isDropped') === 'true';

    if (isDropped) {
      const updatedDroppedBlocks = droppedBlocks.map(block => {
        if (block.id === id) {
          return {
            ...block,
            position: {
              x: e.clientX - e.currentTarget.getBoundingClientRect().left,
              y: e.clientY - e.currentTarget.getBoundingClientRect().top
            }
          };
        }
        return block;
      });
      setDroppedBlocks(updatedDroppedBlocks);
    } else {
      const originalBlock = blocks.find((b) => b.id === id);
      if (originalBlock) {
        const newBlock = {
          ...originalBlock,
          id: Date.now(),
          position: {
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top
          },
          isDropped: true
        };
        setDroppedBlocks([...droppedBlocks, newBlock]);
      }
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '45%' }}>
        <h3>Available Blocks</h3>
        {blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            id={block.id}
            type={block.type}
            data={block.data}
            position={block.position}
            onDragStart={onDragStart}
            isDropped={false}
          />
        ))}
      </div>
      <div
        style={{
          width: '45%',
          height: '1000px',
          border: '2px dashed #000',
          position: 'relative'
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {droppedBlocks.map((block) => (
          <DraggableBlock
            key={block.id}
            id={block.id}
            type={block.type}
            data={block.data}
            position={block.position}
            onDragStart={onDragStart}
            isDropped={true}
          />
        ))}
      </div>
    </div>
  );
};

export default DroppableContainer;
