import React from 'react';
import { HandleComponentType, HandleData } from '../componentTypes';

const DefaultComponent: HandleComponentType<HandleData> = ({
  onElementChange,
}) => (
  <div
    ref={onElementChange}
    style={{
      width: 0,
      height: 0,
      overflow: 'visible',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <div
      style={{
        flex: '0 0 auto',
        width: '20px',
        height: '20px',
        backgroundColor: 'lightgray',
        borderRadius: '100%',
        border: '4px black solid',
        zIndex: 9,
      }}
    />
  </div>
);

export default DefaultComponent;
