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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="relative border border-gray-300 rounded-lg p-5 bg-white shadow-lg"
      style={{
        position: isDropped ? 'absolute' : 'static',
        left: isDropped ? `${x}px` : 'auto',
        top: isDropped ? `${y}px` : 'auto',
        width: '340px',
        cursor: 'grab'
      }}
    >
      <h4 className="text-center text-gray-700 mb-4">Screen Block</h4>
      <input
        type="text"
        name="headerImage"
        placeholder="Header Image URL"
        value={headerImage}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        name="headerText"
        placeholder="Header Text"
        value={headerText}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <div className="flex flex-wrap justify-between">
        {buttons.map((button) => (
          <div key={button.id} className="relative flex flex-col w-1/3 p-2">
            <button
              onClick={() => removeButton(button.id)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              x
            </button>
            <input
              type="text"
              name={`buttonIcon-${button.id}`}
              placeholder="Icon URL"
              value={button.icon}
              onChange={(e) => handleInputChange(e, button.id)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name={`buttonText-${button.id}`}
              placeholder="Button Text"
              value={button.text}
              onChange={(e) => handleInputChange(e, button.id)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>
      <button
        onClick={addButton}
        className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Add Button
      </button>
    </div>
  );
};

export default ScreenBlock;
