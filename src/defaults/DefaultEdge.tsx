import React from 'react';
import { EdgeComponentType, EdgeData, HandleData } from '../componentTypes';

const Edge: EdgeComponentType<EdgeData, HandleData> = ({
  sourcePosition,
  targetPosition,
}) => {
  const [x1, y1] = sourcePosition;
  const [x2, y2] = targetPosition;
  return (
    <>
      <line {...{ x1, x2, y1, y2, stroke: 'black', strokeWidth: 2 }} />
    </>
  );
};

export default Edge;
