import React, { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface NavigateBlockProps {
  id: number;
  data: string;
  position: Position;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number, type: string) => void;
  isDropped: boolean;
  updateBlockData: (id: number, parameters: any) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  onStartConnection?: (id: number, x: number, y: number) => void;
  onEndConnection?: (id: number, x: number, y: number) => void;
}

const NavigateBlock: React.FC<NavigateBlockProps> = ({
  id,
  data,
  position,
  onDragStart,
  isDropped,
  updateBlockData,
  containerRef,
  onStartConnection,
  onEndConnection
}) => {
  const { x, y } = position;
  const [parameters, setParameters] = useState({ position: '', text: data, icon: 'navigateIcon' });
  const blockRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={blockRef}
      id={`block-${id}`}
      draggable
      onDragStart={(e) => onDragStart(e, id, 'navigate')}
      style={{
        position: isDropped ? (containerRef ? 'static' : 'absolute') : 'static',
        left: isDropped ? `${x}px` : 'auto',
        top: isDropped ? `${y}px` : 'auto',
        border: '1px solid #000',
        padding: '10px',
        cursor: 'grab',
        backgroundColor: isDropped ? '#fff' : '#f0f0f0',
        margin: '10px 0',
        width: 'fit-content',
      }}
    >
      <div>
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={parameters.position}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="text"
          placeholder="Text"
          value={parameters.text}
          onChange={handleInputChange}
        />
      </div>
      <div
        onMouseDown={handleStartConnection}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          position: 'absolute',
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
        }}
      />
      <div
        onMouseUp={handleEndConnection}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: 'blue',
          position: 'absolute',
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default NavigateBlock;
