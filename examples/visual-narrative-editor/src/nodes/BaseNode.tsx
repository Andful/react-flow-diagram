import React from 'react';
import { NodeComponentType, NodeId } from '@andful/react-flow-diagram';
import { HandleProps } from '../Handle'

export interface BaseNodeProps {
    id: NodeId,
    type: "base-node"
}

const BaseNode: NodeComponentType<BaseNodeProps, HandleProps> = ({ id, Handler }) => {
    return <>
        <Handler id={`${id}-left`} direction={"left"}/>
            <h1 style={{
                textAlign: 'center',
            }}>Hello World</h1>
        <Handler id={`${id}-right`} direction={"right"}/>
    </>
}

export default BaseNode;