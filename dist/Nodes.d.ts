/// <reference types="react" />
import { NodeComponentType, HandleComponentType, NodeData, HandleData } from './componentTypes';
export interface NodesProps<NodeProps extends NodeData, HandleProps extends HandleData> {
    Node: NodeComponentType<NodeProps, HandleProps>;
    Handle: HandleComponentType<HandleProps>;
    nodes: Readonly<(NodeData & NodeProps)[]>;
    onHandleDataChange: (data: HandleData & HandleProps, element: Element | null) => void;
}
declare function Nodes<NodeProps extends NodeData, HandleProps extends HandleData>({ Node, Handle, nodes, onHandleDataChange, }: NodesProps<NodeProps, HandleProps>): JSX.Element;
declare const _default: typeof Nodes;
export default _default;
//# sourceMappingURL=Nodes.d.ts.map