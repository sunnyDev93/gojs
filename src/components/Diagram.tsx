import React from 'react';
import useGojsDiagram from '../hooks/useGojsDiagram';
import { generateData } from '../utils/generateData';

const Diagram: React.FC = () => {
  const model = generateData();
  const diagramRef = useGojsDiagram(model);

  return (
    <div 
      ref={diagramRef} 
      style={{ 
        width: '100%', 
        height: '500px', 
        border: '1px solid black' 
      }} 
    />
  );
};

export default Diagram;
