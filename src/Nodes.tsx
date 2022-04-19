import React from 'react';
import {
  NodeComponentType,
  HandleComponentType,
  NodeData,
  HandleData,
} from './componentTypes';

export interface NodesProps<
  NodeProps extends NodeData,
  HandleProps extends HandleData,
> {
  Node: NodeComponentType<NodeProps, HandleProps>;
  Handle: HandleComponentType<HandleProps>;
  nodes: Readonly<(NodeData & NodeProps)[]>;
  onHandleDataChange: (
    data: HandleData & HandleProps,
    element: Element | null,
  ) => void;
}

function Nodes<NodeProps extends NodeData, HandleProps extends HandleData>({
  Node,
  Handle,
  nodes,
  onHandleDataChange,
}: NodesProps<NodeProps, HandleProps>): JSX.Element {
  const Handler = React.useMemo(
    () => (props: HandleProps & HandleData) =>
      (
        <Handle
          {...props}
          onElementChange={onHandleDataChange.bind(undefined, props)}
        />
      ),
    [onHandleDataChange],
  );
  return (
    <>
      {nodes.map((nodeProps) => {
        return <Node key={nodeProps.id} Handler={Handler} {...nodeProps} />;
      })}
    </>
  );
}

export default React.memo(Nodes) as typeof Nodes;
