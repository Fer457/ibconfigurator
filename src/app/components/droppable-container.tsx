/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import ActionBlock from "./action-block";
import SequenceBlock from "./sequence-block";
import ScreenBlock from "./screen-block";
import Arrow from "./arrow";
import Image from "next/image";

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
    { id: 1, type: "navigate", data: "", position: { x: 10, y: 10 }, isDropped: false },
    { id: 2, type: "speak", data: "", position: { x: 10, y: 100 }, isDropped: false },
    { id: 3, type: "changeScreen", data: "", position: { x: 10, y: 200 }, isDropped: false },
    { id: 4, type: "sequence", data: "[]", position: { x: 10, y: 300 }, isDropped: false },
    { id: 5, type: "screen", data: "", position: { x: 10, y: 400 }, isDropped: false }
  ]);

  const [droppedBlocks, setDroppedBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentConnection, setCurrentConnection] = useState<Partial<Connection>>({});
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: number, type: string) => {
    e.dataTransfer.setData("blockId", id.toString());
    e.dataTransfer.setData("blockType", type);
    const isDropped = droppedBlocks.some(block => block.id === id);
    e.dataTransfer.setData("isDropped", isDropped.toString());
  };

  const updateBlockData = (id: number, parameters: any) => {
    setDroppedBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, parameters } : block
      )
    );
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = parseInt(e.dataTransfer.getData("blockId"));
    const type = e.dataTransfer.getData("blockType");
    const isDropped = e.dataTransfer.getData("isDropped") === "true";
    const containerRect = containerRef.current!.getBoundingClientRect();
    const dropX = (e.clientX - containerRect.left) / zoom;
    const dropY = (e.clientY - containerRect.top) / zoom;

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
      const originalBlock = blocks.find(b => b.id === id);
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

      updateConnections([...connections, newConnection]);
    }
  };

  const updateConnections = (connections: Connection[]) => {
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
            startX: (startRect.right - containerRect.left) / zoom,
            startY: (startRect.top + startRect.height / 2 - containerRect.top) / zoom,
            endX: (endRect.left - containerRect.left) / zoom,
            endY: (endRect.top + endRect.height / 2 - containerRect.top) / zoom
          };
        }
      }
      return connection;
    });

    setConnections(updatedConnections);
  };

  useEffect(() => {
    updateConnections(connections);
  }, [droppedBlocks, zoom]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom(prevZoom => Math.min(Math.max(prevZoom - e.deltaY * 0.001, 0.5), 1));
  };

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
    <div style={{ display: "flex", height: '100vh', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: '#343a40',
        color: '#fff',
        padding: '10px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 1
      }}>
        <h1 style={{ margin: 0 }}>Intec Configurator Master</h1>
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <div className="sidenav" style={{
          flex: "0 0 250px",
          padding: "20px",
          borderRight: "1px solid #ccc",
          backgroundColor: '#f8f9fa',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}>
          <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Available Blocks</h3>
          {blocks.map(block => {
            switch (block.type) {
              case "navigate":
              case "speak":
              case "changeScreen":
                return (
                  <ActionBlock
                    key={block.id}
                    id={block.id}
                    type={block.type}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={false}
                    updateBlockData={updateBlockData}
                    onStartConnection={onStartConnection}
                    onEndConnection={onEndConnection}
                    containerRef={containerRef}
                  />
                );
              case "sequence":
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
              case "screen":
                return (
                  <ScreenBlock
                    key={block.id}
                    id={block.id}
                    data={block.data}
                    position={block.position}
                    onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                    isDropped={false}
                    updateBlockData={updateBlockData}
                    containerRef={containerRef}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        <div className="main" style={{ flex: 1, overflow: "auto", backgroundColor: '#e9ecef', padding: '20px' }}>
          <div
            className="workspace"
            ref={containerRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onWheel={handleWheel}
            style={{
              position: "relative",
              minHeight: "100vh",
              padding: "20px",
              border: "2px dashed #ccc",
              margin: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundImage: `linear-gradient(90deg, #c2c2c2 1px, transparent 1px),
                                linear-gradient(180deg, #c2c2c2 1px, transparent 1px),
                                linear-gradient(90deg, transparent 1px, #fff 1px),
                                linear-gradient(180deg, transparent 1px, #fff 1px)`,
              backgroundSize: '20px 20px',
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {droppedBlocks.map(block => {
              switch (block.type) {
                case "navigate":
                case "speak":
                case "changeScreen":
                  return (
                    <ActionBlock
                      key={block.id}
                      id={block.id}
                      type={block.type}
                      data={block.data}
                      position={block.position}
                      onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                      isDropped={true}
                      updateBlockData={updateBlockData}
                      onStartConnection={onStartConnection}
                      onEndConnection={onEndConnection}
                      containerRef={containerRef}
                    />
                  );
                case "sequence":
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
                case "screen":
                  return (
                    <ScreenBlock
                      key={block.id}
                      id={block.id}
                      data={block.data}
                      position={block.position}
                      onDragStart={(e, id, type) => onDragStart(e, block.id, block.type)}
                      isDropped={true}
                      updateBlockData={updateBlockData}
                      containerRef={containerRef}
                    />
                  );
                default:
                  return null;
              }
            })}
            {connections.map((conn, index) => (
              <Arrow key={index} startX={conn.startX} startY={conn.startY} endX={conn.endX} endY={conn.endY} />
            ))}
          </div>
        </div>
      </div>
      <button onClick={generateJSON} style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        height: "60px",
        width: "60px",
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s'
      }}>
        <Image src="/rocket.png" width={50} height={50} alt={""} />
      </button>
    </div>
  );
};

export default DroppableContainer;
