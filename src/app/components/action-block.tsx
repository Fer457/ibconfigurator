import React, { useState, useRef, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface ActionBlockProps {
  id: number;
  type: string;
  data: string;
  position: Position;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    id: number,
    type: string
  ) => void;
  isDropped: boolean;
  updateBlockData: (id: number, parameters: any) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  onStartConnection?: (id: number, x: number, y: number) => void;
  onEndConnection?: (id: number, x: number, y: number) => void;
}

const ActionBlock: React.FC<ActionBlockProps> = ({
  id,
  type,
  data,
  position,
  onDragStart,
  isDropped,
  updateBlockData,
  containerRef,
  onStartConnection,
  onEndConnection,
}) => {
  const { x, y } = position;
  const [parameters, setParameters] = useState<any>({});

  useEffect(() => {
    if (type === "navigate") {
      setParameters({ position: "", text: data, icon: "navigateIcon" });
    } else if (type === "speak") {
      setParameters({ phrase: data, text: `Say "${data}"`, icon: "speakIcon" });
    } else if (type === "changeScreen") {
      setParameters({ screen: "", text: data, icon: "screenIcon" });
    }
  }, [type, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedParameters = { ...parameters, [name]: value };
    setParameters(updatedParameters);
    updateBlockData(id, updatedParameters);
  };

  useEffect(() => {
    if (isDropped && blockRef.current) {
      blockRef.current.style.left = `${x}px`;
      blockRef.current.style.top = `${y}px`;
    }
  }, [isDropped, x, y]);

  const handleStartConnection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onStartConnection) {
      const rect = blockRef.current!.getBoundingClientRect();
      onStartConnection(id, rect.left + rect.width, rect.top + rect.height / 2);
    }
  };

  const handleEndConnection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onEndConnection) {
      const rect = blockRef.current!.getBoundingClientRect();
      onEndConnection(id, rect.left, rect.top + rect.height / 2);
    }
  };

  const blockRef = useRef<HTMLDivElement>(null);

  console.log(containerRef);

  return (
    <div
      ref={blockRef}
      id={`block-${id}`}
      draggable
      onDragStart={(e) => onDragStart(e, id, type)}
      style={{
        position: isDropped ? "absolute" : "static",
        left: isDropped ? `${x}px` : "auto",
        top: isDropped ? `${y}px` : "auto",
        border: "1px solid #007BFF",
        borderRadius: "8px",
        padding: "10px",
        cursor: "grab",
        backgroundColor: isDropped ? "#ffffff" : "#f8f9fa",
        margin: "10px 0",
        width: "200px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s, box-shadow 0.3s",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {type === "navigate" && (
          <>
          <h1>{type}</h1>
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={parameters.position}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                width: "100%",
                boxSizing: "border-box",
                fontSize: "0.9em",
              }}
            />
          </>
        )}
        {type === "speak" && (
          <>
          <h1>{type}</h1>
            <input
              type="text"
              name="phrase"
              placeholder="Phrase"
              value={parameters.phrase}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                width: "100%",
                boxSizing: "border-box",
                fontSize: "0.9em",
              }}
            />
          </>
        )}
        {type === "changeScreen" && (
          <>
          <h1>{type}</h1>
            <input
              type="text"
              name="screen"
              placeholder="Screen"
              value={parameters.screen}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                width: "100%",
                boxSizing: "border-box",
                fontSize: "0.9em",
              }}
            />
          </>
        )}
      </div>
          <div
            onMouseDown={handleStartConnection}
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#FF4136",
              position: "absolute",
              right: "-6px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              borderRadius: "50%",
              boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div
            onMouseUp={handleEndConnection}
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#007BFF",
              position: "absolute",
              left: "-6px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              borderRadius: "50%",
              boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
            }}
          />
    </div>
  );
};

export default ActionBlock;
