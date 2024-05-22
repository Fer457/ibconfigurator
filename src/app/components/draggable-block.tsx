import React, { useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Parameters {
  [key: string]: string | number | Array<{ [key: string]: string | number }>;
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
  const [action, setAction] = useState<string>('navigate');
  const [parameters, setParameters] = useState<Parameters>({ text: '', position: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParameters({
      ...parameters,
      [name]: value
    });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value);
  };

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
      <div>
        {type === 'text' && <div>{data}</div>}
        {type === 'image' && <img src={data} alt="Block" style={{ maxWidth: '100%' }} />}
        {type === 'button' && <button>{data}</button>}
      </div>
      {isDropped && (
        <div>
          <select value={action} onChange={handleActionChange}>
            <option value="navigate">Navigate</option>
            <option value="changeScreen">Change Screen</option>
            <option value="speak">Speak</option>
            <option value="sequence">Sequence</option>
          </select>
          {action !== 'sequence' && (
            <div>
              <input
                type="text"
                name="text"
                placeholder="Text"
                value={parameters.text}
                onChange={handleInputChange}
              />
              {action === 'navigate' && (
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={parameters.position}
                  onChange={handleInputChange}
                />
              )}
              {action === 'speak' && (
                <input
                  type="text"
                  name="phrase"
                  placeholder="Phrase"
                  value={parameters.phrase}
                  onChange={handleInputChange}
                />
              )}
              {action === 'changeScreen' && (
                <input
                  type="text"
                  name="screen"
                  placeholder="Screen"
                  value={parameters.screen}
                  onChange={handleInputChange}
                />
              )}
            </div>
          )}
          {action === 'sequence' && (
            <div>
              <textarea
                name="actions"
                placeholder='[{ "action": "speak", "parameters": { "phrase": "Hello" } }]'
                value={JSON.stringify(parameters.actions || [])}
                onChange={(e) => handleInputChange({ target: { name: 'actions', value: e.target.value } })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DraggableBlock;
