/// <reference types="react" />
import { ReadonlyMat4 } from 'gl-matrix';
import { NodeComponentType, EdgeComponentType, HandleComponentType, NodeData, EdgeData, HandleData } from './componentTypes';
export interface DiagramProps<NodeProps extends NodeData, EdgeProps extends EdgeData, HandleProps extends HandleData> {
    Node: NodeComponentType<NodeProps, HandleProps>;
    transform?: ReadonlyMat4;
    Edge?: EdgeComponentType<EdgeProps, HandleProps>;
    Handle?: HandleComponentType<HandleProps>;
    nodes?: NodeProps[];
    edges?: EdgeProps[];
    nodesZ?: number;
    edgesZ?: number;
}
declare function Diagram<NodeProps extends NodeData, EdgeProps extends EdgeData, HandleProps extends HandleData>(props: DiagramProps<NodeProps, EdgeProps, HandleProps>): JSX.Element;
export default Diagram;
//# sourceMappingURL=Diagram.d.ts.map