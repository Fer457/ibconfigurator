"use client";

import React, { useState, useRef, useEffect } from 'react';
import NavigateBlock from './navigate-block';
import SpeakBlock from './speak-block';
import ChangeScreenBlock from './change-screen-block';
import SequenceBlock from './sequence-block';
import Arrow from './arrow';

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
  parameters?: any;
}

interface Connection {
  startId: number;
  endId: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const DroppableContainer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'navigate', data: '', position: { x: 10, y: 10 }, isDropped: false },
    { id: 2, type: 'speak', data: '', position: { x: 10, y: 100 }, isDropped: false },
    { id: 3, type: 'changeScreen', data: '', position: { x: 10, y: 200 }, isDropped: false },
    { id: 4, type: 'sequence', data: '[]', position: { x: 10, y: 300 }, isDropped: false }
  ]);

  const [droppedBlocks, setDroppedBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentConnection, setCurrentConnection] = useState<Partial<Connection>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: number, type: string) => {
    e.dataTransfer.setData('blockId', id.toString());
    e.dataTransfer.setData('blockType', type);
    const isDropped = droppedBlocks.some(block => block.id === id);
    e.dataTransfer.setData('isDropped', isDropped.toString());
  };

  const updateBlockData = (id: number, parameters: any) => {
    setDroppedBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, parameters } : block
      )
    );
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = parseInt(e.dataTransfer.getData('blockId'));
    const type = e.dataTransfer.getData('blockType');
    const isDropped = e.dataTransfer.getData('isDropped') === 'true';
    const containerRect = containerRef.current!.getBoundingClientRect();
    const dropX = e.clientX - containerRect.left;
    const dropY = e.clientY - containerRect.top;

    if (isDropped) {
      const updatedDroppedBlocks = droppedBlocks.map(block => {
        if (block.id === id) {
          const blockElement = document.getElementById(`block-${id}`);
          const offsetX = blockElement ? blockElement.clientWidth / 2 : 0;
          const offsetY = blockElement ? blockElement.clientHeight / 2 : 0;
          return {
            ...block,
            position: {
              x: dropX - offsetX,
              y: dropY - offsetY
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
          type: type,
          position: {
            x: dropX,
            y: dropY
          },
          isDropped: true,
          parameters: originalBlock.parameters
        };
        setDroppedBlocks([...droppedBlocks, newBlock]);
      }
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onStartConnection = (id: number, x: number, y: number) => {
    setCurrentConnection({ startId: id, startX: x, startY: y });
  };

  const onEndConnection = (id: number, x: number, y: number) => {
    if (currentConnection.startId !== undefined) {
      const newConnection = { ...currentConnection, endId: id, endX: x, endY: y } as Connection;
      setConnections([...connections, newConnection]);
      setCurrentConnection({});
      
      const startBlock = droppedBlocks.find(block => block.id === newConnection.startId);
      const endBlock = droppedBlocks.find(block => block.id === newConnection.endId);

      if (startBlock && endBlock) {
        const startRect = document.getElementById(`block-${startBlock.id}`)?.getBoundingClientRect();
        const endRect = document.getElementById(`block-${endBlock.id}`)?.getBoundingClientRect();

        if (startRect && endRect) {
          const containerRect = containerRef.current!.getBoundingClientRect();
          const updatedConnection = {
            ...newConnection,
            startX: startRect.right - containerRect.left,
            startY: startRect.top + startRect.height / 2 - containerRect.top,
            endX: endRect.left - containerRect.left,
            endY: endRect.top + endRect.height / 2 - containerRect.top
          };
          setConnections(connections => connections.map(conn => conn === newConnection ? updatedConnection : conn));
        }
      }
    }
  };

  useEffect(() => {
    const updatedConnections = connections.map(connection => {
      const startBlock = droppedBlocks.find(block => block.id === connection.startId);
      const endBlock = droppedBlocks.find(block => block.id === connection.endId);

      if (startBlock && endBlock) {
        const startRect = document.getElementById(`block-${startBlock.id}`)?.getBoundingClientRect();
        const endRect = document.getElementById(`block-${endBlock.id}`)?.getBoundingClientRect();

        if (startRect && endRect) {
          const containerRect = containerRef.current!.getBoundingClientRect();
          return {
            ...connection,
            startX: startRect.right - containerRect.left,
            startY: startRect.top + startRect.height / 2 - containerRect.top,
            endX: endRect.left - containerRect.left,
            endY: endRect.top + endRect.height / 2 - containerRect.top
          };
        }
      }
      return connection;
    });

    setConnections(updatedConnections);
  }, [droppedBlocks]);

  const generateJSON = () => {
    const jsonConfig = {
      headerText: "Test fer config",
      mainScreen: droppedBlocks.map((block, index) => ({
        button: index + 1,
        action: block.type,
        parameters: block.parameters || {}
      }))
    };

    console.log(JSON.stringify(jsonConfig, null, 2));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidenav" style={{ flex: '0 0 250px', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>Available Blocks</h3>
        {blocks.map((block) => {
          switch (block.type) {
            case 'navigate':
              return (
                <NavigateBlock
                  key={block.id}
                  id={block.id}
                  data={block.data}
                  position={block.position}
                  onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                  isDropped={false}
                  updateBlockData={updateBlockData}
                  onStartConnection={onStartConnection}
                  onEndConnection={onEndConnection}
                />
              );
            case 'speak':
              return (
                <SpeakBlock
                  key={block.id}
                  id={block.id}
                  data={block.data}
                  position={block.position}
                  onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                  isDropped={false}
                  updateBlockData={updateBlockData}
                  onStartConnection={onStartConnection}
                  onEndConnection={onEndConnection}
                />
              );
            case 'changeScreen':
              return (
                <ChangeScreenBlock
                  key={block.id}
                  id={block.id}
                  data={block.data}
                  position={block.position}
                  onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                  isDropped={false}
                  updateBlockData={updateBlockData}
                  onStartConnection={onStartConnection}
                  onEndConnection={onEndConnection}
                />
              );
            case 'sequence':
              return (
                <SequenceBlock
                  key={block.id}
                  id={block.id}
                  data={block.data}
                  position={block.position}
                  onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                  isDropped={false}
                  updateBlockData={updateBlockData}
                  onStartConnection={onStartConnection}
                  onEndConnection={onEndConnection}
                />
              );
            default:
              return null;
          }
        })}
      </div>
      <div className="main" style={{ flex: 1, overflow: 'auto' }}>
        <div
          className="workspace"
          ref={containerRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{
            position: 'relative',
            minHeight: '100vh',
            padding: '10px',
            border: '2px dashed #ccc',
          }}
        >
          {droppedBlocks.map((block) => {
            switch (block.type) {
              case 'navigate':
                return (
                  <NavigateBlock
                    key={block.id}
                    id={block.id}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={true}
                    updateBlockData={updateBlockData}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                  />
                );
              case 'speak':
                return (
                  <SpeakBlock
                    key={block.id}
                    id={block.id}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={true}
                    updateBlockData={updateBlockData}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                  />
                );
              case 'changeScreen':
                return (
                  <ChangeScreenBlock
                    key={block.id}
                    id={block.id}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={true}
                    updateBlockData={updateBlockData}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                  />
                );
              case 'sequence':
                return (
                  <SequenceBlock
                    key={block.id}
                    id={block.id}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={true}
                    updateBlockData={updateBlockData}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                  />
                );
              default:
                return null;
            }
          })}
          {connections.map((conn, index) => (
            <Arrow
              key={index}
              startX={conn.startX}
              startY={conn.startY}
              endX={conn.endX}
              endY={conn.endY}
            />
          ))}
        </div>
      </div>
      <button onClick={generateJSON} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        Generate JSON
      </button>
    </div>
  );
};

export default DroppableContainer;
