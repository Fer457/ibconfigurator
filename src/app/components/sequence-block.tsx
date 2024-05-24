/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import ActionBlock from "./action-block";

interface Position {
  x: number;
  y: number;
}

interface SequenceBlockProps {
  id: number;
  data: string;
  position: Position;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    id: number,
    type: string
  ) => void;
  isDropped: boolean;
  updateBlockData: (id: number, parameters: any) => void;
  onStartConnection?: (id: number, x: number, y: number) => void;
  onEndConnection?: (id: number, x: number, y: number) => void;
}

interface Block {
  id: number;
  type: string;
  data: string;
  position: Position;
  isDropped: boolean;
  parameters?: any;
}

const SequenceBlock: React.FC<SequenceBlockProps> = ({
  id,
  data,
  position,
  onDragStart,
  isDropped,
  updateBlockData,
  onStartConnection,
  onEndConnection,
}) => {
  const { x, y } = position;
  const [internalBlocks, setInternalBlocks] = useState<Block[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const blockId = parseInt(e.dataTransfer.getData("blockId"));
    const blockType = e.dataTransfer.getData("blockType");

    const newBlock: Block = {
      id: Date.now(),
      type: blockType,
      data: "",
      position: { x: 0, y: 0 },
      isDropped: true,
      parameters: {},
    };

    const containerRect = containerRef.current!.getBoundingClientRect();
    const dropX = e.clientX - containerRect.left;
    const dropY = e.clientY - containerRect.top;

    newBlock.position = { x: dropX, y: dropY };

    const updatedBlocks = [...internalBlocks, newBlock];
    setInternalBlocks(updatedBlocks);
    updateBlockData(id, { actions: updatedBlocks });
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    updateBlockData(id, { actions: internalBlocks });
  }, [internalBlocks]);

  const updateInternalBlockData = (internalId: number, parameters: any) => {
    setInternalBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === internalId ? { ...block, parameters } : block
      )
    );
  };

  const handleStartConnection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onStartConnection) {
      const rect = containerRef.current!.getBoundingClientRect();
      onStartConnection(id, rect.left + rect.width, rect.top + rect.height / 2);
    }
  };

  const handleEndConnection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onEndConnection) {
      const rect = containerRef.current!.getBoundingClientRect();
      onEndConnection(id, rect.left, rect.top + rect.height / 2);
    }
  };

  return (
    <div
      ref={containerRef}
      id={`block-${id}`}
      draggable
      onDragStart={(e) => onDragStart(e, id, "sequence")}
      style={{
        position: isDropped ? "absolute" : "static",
        left: isDropped ? `${x}px` : "auto",
        top: isDropped ? `${y}px` : "auto",
        border: "1px solid #000",
        padding: "10px",
        cursor: "grab",
        backgroundColor: isDropped ? "#fff" : "#f0f0f0",
        margin: isDropped ? "0" : "10px 0",
        width: "fit-content",
        minHeight: "200px",
        minWidth: "300px",
      }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          position: "relative",
          border: "1px dashed #000",
          padding: "10px",
          minHeight: "200px",
        }}
      >
        {internalBlocks.map((block) => {
          return (
            <ActionBlock
              key={block.id}
              id={block.id}
              type={block.type}
              data={block.data}
              position={block.position}
              onDragStart={(e, id, type) =>
                onDragStart(e, block.id, block.type)
              }
              isDropped={false}
              updateBlockData={updateBlockData}
              onStartConnection={onStartConnection}
              onEndConnection={onEndConnection}
            />
          );
        })}
      </div>
      <div
        onMouseDown={handleStartConnection}
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: "red",
          position: "absolute",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
      />
      <div
        onMouseUp={handleEndConnection}
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: "blue",
          position: "absolute",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default SequenceBlock;
