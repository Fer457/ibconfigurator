/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface ButtonConfig {
  id: number;
  text: string;
  icon: string;
}

interface ScreenBlockProps {
  id: number;
  data: string;
  position: Position;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number, type: string) => void;
  isDropped: boolean;
  updateBlockData: (id: number, parameters: any) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const ScreenBlock: React.FC<ScreenBlockProps> = ({
  id,
  data,
  position,
  onDragStart,
  isDropped,
  updateBlockData,
  containerRef
}) => {
  const { x, y } = position;
  const [headerImage, setHeaderImage] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDropped && blockRef.current) {
      blockRef.current.style.left = `${x}px`;
      blockRef.current.style.top = `${y}px`;
    }
  }, [isDropped, x, y]);

  useEffect(() => {
    updateBlockData(id, {
      headerImage,
      headerText,
      buttons
    });
  }, [headerImage, headerText, buttons]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const { name, value } = e.target;
    if (name === 'headerImage') {
      setHeaderImage(value);
    } else if (name === 'headerText') {
      setHeaderText(value);
    } else if (name.startsWith('buttonText-') && id !== undefined) {
      setButtons(buttons.map(button => button.id === id ? { ...button, text: value } : button));
    } else if (name.startsWith('buttonIcon-') && id !== undefined) {
      setButtons(buttons.map(button => button.id === id ? { ...button, icon: value } : button));
    }
  };

  const addButton = () => {
    const newButton: ButtonConfig = {
      id: buttons.length + 1,
      text: '',
      icon: ''
    };
    setButtons([...buttons, newButton]);
  };

  const removeButton = (id: number) => {
    setButtons(buttons.filter(button => button.id !== id));
  };

  return (
    <div
      ref={blockRef}
      id={`block-${id}`}
      draggable
      onDragStart={(e) => onDragStart(e, id, 'screen')}
      style={{
        position: isDropped ? 'absolute' : 'static',
        left: isDropped ? `${x}px` : 'auto',
        top: isDropped ? `${y}px` : 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'grab',
        backgroundColor: isDropped ? '#fff' : '#f0f0f0',
        margin: '10px 0',
        width: '340px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#333' }}>Screen Block</h4>
      <input
        type="text"
        name="headerImage"
        placeholder="Header Image"
        value={headerImage}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <input
        type="text"
        name="headerText"
        placeholder="Header Text"
        value={headerText}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
        {buttons.map((button) => (
          <div key={button.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', width: '30%' }}>
            <input
              type="text"
              name={`buttonIcon-${button.id}`}
              placeholder="Icon URL"
              value={button.icon}
              onChange={(e) => handleInputChange(e, button.id)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="text"
              name={`buttonText-${button.id}`}
              placeholder="Button Text"
              value={button.text}
              onChange={(e) => handleInputChange(e, button.id)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <button onClick={() => removeButton(button.id)} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>x</button>
          </div>
        ))}
      </div>
      <button onClick={addButton} style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer'
      }}>Add Button</button>
    </div>
  );
};

export default ScreenBlock;
