import styled from '@emotion/styled';
import React from 'react';
import { EdgeComponentType, EdgeData } from '@andful/react-flow-diagram';
import { AppContext } from './App';
import DeleteButton from './DeleteButton';
import { HandleProps } from './Handle'

const Path = styled.path`
    stroke-dasharray: 5;
    animation: dashdraw .5s linear infinite;
    stroke-width: 4px;
    stroke: black;
    fill: none;
`

const BUTTON_SIZE = 20;

const Edge: EdgeComponentType<EdgeData, HandleProps> = ({
    source,
    sourcePosition: [x1, y1],
    target,
    targetPosition: [x2, y2],
}) => {
    const { deleteEdge } = React.useContext(AppContext);
    return <>
        <Path d={`M ${x1} ${y1} C ${x1 + 100} ${y1} ${x2 - 100} ${y2} ${x2} ${y2}`} />
        <foreignObject x={(x1 + x2) / 2 - BUTTON_SIZE / 2} y={(y1 + y2) / 2 - BUTTON_SIZE / 2} width={BUTTON_SIZE} height={BUTTON_SIZE}>
            <DeleteButton
            style={{
                pointerEvents: 'all'
            }}
            onClick={() => {
                deleteEdge(source.id, target.id);
            }} />
        </foreignObject>
    </>
}

export default Edge;