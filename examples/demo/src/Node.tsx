import React from 'react'
import styled from "@emotion/styled";
import { NodeComponentType, NodeId } from "react-flow-diagram";
import { AppContext } from './App'
import BaseNode, { BaseNodeProps } from './nodes/BaseNode';
import DialogueNode, { DialogueNodeProps } from './nodes/DialogueNode'
import DialogueOptionsNode, { DialogueOptionsNodeProps } from './nodes/DialogueOptionsNode'
import { HandleProps } from './Handle';
import DeleteButton from './DeleteButton';


interface NodeWrapperProps {
    x: number,
    y: number,
    width: number,
}

export type NodeProps = NodeWrapperProps & { id: NodeId } & (BaseNodeProps | DialogueNodeProps | DialogueOptionsNodeProps);

const NodeDiscriminator: NodeComponentType<NodeProps, HandleProps> = (props) => {
    if (props.type === 'base-node') {
        return <BaseNode {...props}></BaseNode>
    } else if (props.type === 'dialogue-node') {
        return <DialogueNode {...props}></DialogueNode>
    } else if (props.type === 'dialogue-options-node') {
        return <DialogueOptionsNode {...props}></DialogueOptionsNode>
    } else {
        return <>Error</>
    }
}

const NodeWrapper = styled.div`
    pointer-events: all;
    position: absolute;
`

const NodeFlex = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
`

const NodeBar = styled.div`
    border-radius: 10px 10px 0 0;
    border: black 3px solid;
    height: 20px;
    flex: 1 1 auto;
    background-color: gray;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
`

const NodeGrab = styled.div`
    flex: 1 1 auto;
`

const NodeContent = styled.div`
    border: black 3px solid;
    border-top: 0;
    flex: 1 1 auto;
    position: relative;
    user-select: none;
    background-color: white;
    border-radius: 0 0 10px 10px;
    padding: 0 16px;
`

const ResizeBar = styled.div`
    position: absolute;
    width: 3px;
    height: calc(100% - 10px);
    top: 5px;
    background-color: blue;
    opacity: 0;
    &:hover {
        opacity: 1;
    }
    cursor: ew-resize;
`



const Node: NodeComponentType<NodeProps, HandleProps> = (props) => {
    const { id, x, y, width } = props;
    const { scale, setNodeProps, deleteNode } = React.useContext(AppContext);
    const [moving, setMoving] = React.useState(false);

    return (
        <NodeWrapper
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`
            }}
        >
            <NodeFlex>
                <NodeBar>
                    <NodeGrab
                        style={{ cursor: moving ? 'grabbing' : 'grab' }}
                        onMouseDown={(e) => {
                            if (moving) {
                                return;
                            }
                            const baseX = x;
                            const baseY = y;
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const onmousemove = (e: MouseEvent) => {
                                setNodeProps({
                                    id,
                                    x: baseX + (e.clientX - startX) / scale,
                                    y: baseY + (e.clientY - startY) / scale,
                                });
                            };
                            const onmouseup = (e: MouseEvent) => {
                                setMoving(false)
                                setNodeProps({
                                    id,
                                    x: baseX + (e.clientX - startX) / scale,
                                    y: baseY + (e.clientY - startY) / scale,
                                });
                                document.body.style.removeProperty('cursor');
                                window.removeEventListener('mousemove', onmousemove);
                                window.removeEventListener('mouseup', onmouseup);
                            }
                            setMoving(true)
                            document.body.style.setProperty('cursor', 'grabbing');
                            window.addEventListener('mousemove', onmousemove);
                            window.addEventListener('mouseup', onmouseup);
                        }}
                    />
                    <DeleteButton style={{flex: '0 0 auto'}} onClick={() => {
                        deleteNode(id)
                    }}/>
                </NodeBar>
                <NodeContent>
                    <NodeDiscriminator {...props} />
                </NodeContent>
            </NodeFlex>
            <ResizeBar
                style={{ left: '0' }}
                onMouseDown={(e) => {
                    const element = e.currentTarget;
                    const startX = e.clientX;
                    const onmousemove = (e: MouseEvent) => {
                        const delta = (e.clientX - startX)/scale;
                        const newWidth = Math.max(300, width - delta);
                        const newX = x + width - newWidth;
                        setNodeProps({
                            id,
                            x: newX,
                            width: newWidth
                        });
                    };
                    const onmouseup = () => {
                        window.removeEventListener('mousemove', onmousemove);
                        window.removeEventListener('mouseup', onmouseup);
                        document.body.style.removeProperty('cursor');
                        element.style.removeProperty('opacity');
                    }
                    window.addEventListener('mousemove', onmousemove)
                    window.addEventListener('mouseup', onmouseup)
                    document.body.style.cursor = 'ew-resize';
                    element.style.opacity = '1';
                }}
            />
            <ResizeBar
                style={{ right: '0' }}
                onMouseDown={(e) => {
                    const element = e.currentTarget;
                    const startX = e.clientX;
                    const onmousemove = (e: MouseEvent) => {
                        const delta = e.clientX - startX;
                        const newWidth =  Math.max(300, width + delta);
                        setNodeProps({
                            id,
                            width: newWidth
                        });
                    };
                    const onmouseup = () => {
                        window.removeEventListener('mousemove', onmousemove);
                        window.removeEventListener('mouseup', onmouseup);
                        document.body.style.removeProperty('cursor');
                        element.style.removeProperty('opacity');
                    }
                    window.addEventListener('mousemove', onmousemove)
                    window.addEventListener('mouseup', onmouseup)
                    document.body.style.cursor = `ew-resize`;
                    element.style.opacity = '1';
                }} />
        </NodeWrapper>);
}

export default Node;