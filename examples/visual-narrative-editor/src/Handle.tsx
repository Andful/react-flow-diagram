import React from "react";
import { HandleComponentType, HandleId } from "@andful/react-flow-diagram";
import styled from "@emotion/styled";
import { AppContext } from "./App";

const Elem = styled.div`
    width: 0;
    height: 0;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
`

const Circle = styled.div`
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    background-color: lightgray;
    border-radius: 100%;
    border: 4px black solid;
    z-index: 9;
`

export interface HandleProps {
    id: HandleId
    direction: "left" | "right"
}

const Handle: HandleComponentType<HandleProps> = ({ id, onElementChange, direction }) => {
    const { newEdge, setNewEdge, addEdge } = React.useContext(AppContext)
    return <Elem ref={onElementChange} style={direction === "left" ? { left: '0' } : { right: '0' }}>
        <Circle
            onMouseUp={() => { if (newEdge !== null && newEdge.source.id !== id) { addEdge(newEdge.source.id, id) } }}
            onMouseDown={(e) => {
                console.log('mousedown', id);
                const onmousemove = ({ clientX, clientY }: { clientX: number, clientY: number }) => setNewEdge({
                    source: {
                        endpointType: 'handle-id',
                        id
                    },
                    target: {
                        endpointType: 'client-space',
                        id: 'mouse',
                        position: [clientX, clientY],
                    }
                })
                onmousemove(e);

                const onmouseup = () => {
                    window.removeEventListener('mousemove', onmousemove);
                    window.removeEventListener('mouseup', onmouseup);
                    setNewEdge(null);
                }
                window.addEventListener('mousemove', onmousemove);
                window.addEventListener('mouseup', onmouseup);
            }}
        />
    </Elem>
}


export default Handle;

