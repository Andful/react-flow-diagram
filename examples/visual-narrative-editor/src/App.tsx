import { Diagram, EdgeData, HandleId, NodeId } from "@andful/react-flow-diagram";
import React from 'react'
import styled from "@emotion/styled"
import Node, { NodeProps } from './Node'
import Handle from './Handle'
import Edge from './Edge'
import Backgound from './Background'
import { vec2, mat4 } from 'gl-matrix'
import { v4 as uuidv4 } from 'uuid'

const Main = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: strech;
    align-items: strech;
`

const DiagramWrapper = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
`

const Content = styled.div`
    position: relative;
    flex: 1 1 auto;
`

const Sidebar = styled.div`
    flex: 0 0 auto;
    width: 90px;
    border-right: 3px solid black;
    display: flex;
    flex-direction: column;
`

const Button = styled.button`
    flex: 1 1 auto;
`

export interface AppContextType {
    scale: number,
    setNodeProps: (props: Partial<NodeProps> & { id: NodeId }) => void;
    deleteNode: (id: NodeId, handleIds?: HandleId[]) => void;
    charactersReferenceCount: Map<string, bigint>;
    setCharacterReferenceCount: (e: Map<string, bigint>) => void;
    addEdge: (source: HandleId, target: HandleId) => void;
    deleteEdge: (source: HandleId, target: HandleId) => void;
    newEdge: EdgeData | null;
    setNewEdge: (e: EdgeData | null) => void;
}

export const AppContext = React.createContext<AppContextType>({
    scale: 0,
    setNodeProps: () => {/* do nothing*/ },
    deleteNode: () => {/* do nothing*/ },
    charactersReferenceCount: new Map(),
    setCharacterReferenceCount: () => {/* do nothing*/ },
    addEdge: () => {/* do nothing*/ },
    deleteEdge: () => {/* do nothing*/ },
    newEdge: null,
    setNewEdge: () => {/* do nothing*/ },
});

interface Content {
    nodes: NodeProps[],
    edges: {
        source: string,
        target: string,
    }[],
}

const App = () => {

    const [nodes, setNodes] = React.useState<NodeProps[]>([]);
    const [edges, setEdges] = React.useState<EdgeData[]>([]);

    const [charactersReferenceCount, setCharacterReferenceCount] = React.useState<Map<string, bigint>>(new Map());
    const [newEdge, setNewEdge] = React.useState<EdgeData | null>(null);
    const [focusedHandle, setFocusedHandle] = React.useState<HandleId | null>(null);
    const [exponentialScale, setExponentialScale] = React.useState(Math.E);
    const scale = Math.log(exponentialScale);
    const [offset, setOffset] = React.useState(vec2.create());
    const transform = React.useMemo(() => {
        const scaleMat = mat4.fromScaling(mat4.create(), [scale, scale, 1]);
        const translateMat = mat4.fromTranslation(mat4.create(), [offset[0], offset[1], 1]);
        return mat4.multiply(mat4.create(), translateMat, scaleMat);
    }, [scale, offset]);

    const setNodeProps = React.useCallback((props: Partial<NodeProps> & { id: NodeId }) => {
        const newNodes = nodes.map((p) => p.id !== props.id ? p : Object.assign(p, props));
        setNodes(newNodes);
    }, [nodes]);

    const deleteNode = React.useCallback((id: NodeId) => {
        const newNodes = nodes.filter((p) => p.id !== id);
        setNodes(newNodes);
        const newEdges = edges.filter((e) =>
            !e.source.id.startsWith(`${id}-`) && !e.target.id.startsWith(`${id}-`)
        );
        setEdges(newEdges);
    }, [nodes, edges]);

    const onWheel = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        const delta = e.deltaY / 1000;
        const newExponentialScale = Math.max(
            Math.min(
                exponentialScale + delta,
                3 * Math.E
            ), Math.E / 2
        );
        setExponentialScale(newExponentialScale)
        const ratio = Math.log(newExponentialScale) / Math.log(exponentialScale)
        setOffset([
            ratio * offset[0],
            ratio * offset[1],
        ]);
    }, [offset, exponentialScale])

    return (<React.StrictMode>
        <Main>
            <Sidebar>
                <Button onClick={() => {
                    setNodes([{
                        id: uuidv4(),
                        type: 'dialogue-node',
                        x: -offset[0] / scale,
                        y: -offset[1] / scale,
                        width: 300,
                        character: null,
                        dialogue: "",
                    }, ...nodes])
                }}>new single line dialog</Button>
                <Button onClick={() => {
                    setNodes([{
                        id: uuidv4(),
                        type: 'dialogue-options-node',
                        x: -offset[0] / scale,
                        y: -offset[1] / scale,
                        width: 300,
                        character: null,
                        options: [],
                    }, ...nodes])
                }}>new multiline dialog</Button>
            </Sidebar>
            <Content
                onWheel={onWheel}
            >
                <Backgound
                    offset={offset}
                    scale={scale}
                    onPointerMove={(e) => {
                        if ((e.buttons & 1) === 1 && newEdge === null) {
                            setOffset([offset[0] + e.movementX, offset[1] + e.movementY]);
                        }
                    }}
                />
                <DiagramWrapper>
                    <AppContext.Provider value={{
                        scale,
                        setNodeProps,
                        deleteNode,
                        charactersReferenceCount,
                        setCharacterReferenceCount,
                        newEdge,
                        setNewEdge,
                        addEdge: (source, target) => {
                            console.log({ source, target })
                            setEdges([{
                                source: {
                                    endpointType: 'handle-id',
                                    id: source
                                },
                                target: {
                                    endpointType: 'handle-id',
                                    id: target
                                },
                            }, ...edges])
                        },
                        deleteEdge: (source, target) => {
                            console.log({ source, target })
                            setEdges(edges.filter(e => e.source.id !== source || e.target.id !== target))
                        },
                    }}>
                        <Diagram
                            transform={transform}
                            Node={Node}
                            Edge={Edge}
                            Handle={Handle}
                            nodes={nodes}
                            edges={newEdge === null ? edges : [newEdge, ...edges]}
                        />
                    </AppContext.Provider>
                </DiagramWrapper>
            </Content>
        </Main>
    </React.StrictMode>)
}

export default App
