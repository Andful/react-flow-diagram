import React from 'react';
import { mat4, vec2, ReadonlyMat4, ReadonlyVec2 } from 'gl-matrix';
import DefaultEdge from './defaults/DefaultEdge';
import DefaultHandle from './defaults/DefaultHandle';
import {
  NodeComponentType,
  EdgeComponentType,
  HandleComponentType,
  HandleId,
  NodeData,
  EdgeData,
  HandleData,
} from './componentTypes';
import Nodes from './Nodes';
import Edges from './Edges';
import { mat4ToTransformMatrix } from './util';

const invertWithOffset: (
  out: mat4,
  transform: ReadonlyMat4,
  offset: ReadonlyVec2,
) => mat4 = (() => {
  const translationMatrix = mat4.create();
  const inverseMatrix = mat4.create();
  return function (out, transform, offset) {
    mat4.fromTranslation(translationMatrix, [-offset[0], -offset[1], 0]);
    mat4.invert(inverseMatrix, transform);
    return mat4.multiply(out, inverseMatrix, translationMatrix);
  };
})();

export interface DiagramProps<
  NodeProps extends NodeData,
  EdgeProps extends EdgeData,
  HandleProps extends HandleData,
> {
  Node: NodeComponentType<NodeProps, HandleProps>;
  transform?: ReadonlyMat4;
  Edge?: EdgeComponentType<EdgeProps, HandleProps>;
  Handle?: HandleComponentType<HandleProps>;
  nodes?: NodeProps[];
  edges?: EdgeProps[];
  nodesZ?: number;
  edgesZ?: number;
}

const EMPTY_LIST: Readonly<unknown[]> = [];
const IDENTITY: mat4 = mat4.create();

function Diagram<
  NodeProps extends NodeData,
  EdgeProps extends EdgeData,
  HandleProps extends HandleData,
>(props: DiagramProps<NodeProps, EdgeProps, HandleProps>) {
  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleElements = React.useMemo<Map<HandleId, [HandleProps, Element]>>(
    () => new Map(),
    [],
  );

  const { Node, nodesZ, edgesZ } = props;
  const Edge =
    props.Edge !== undefined
      ? props.Edge
      : (DefaultEdge as EdgeComponentType<EdgeProps, HandleProps>);
  const Handle =
    props.Handle !== undefined
      ? props.Handle
      : (DefaultHandle as HandleComponentType<HandleProps>);
  const transform = props.transform !== undefined ? props.transform : IDENTITY;
  const nodes =
    props.nodes !== undefined ? props.nodes : (EMPTY_LIST as NodeProps[]);
  const edges =
    props.edges !== undefined ? props.edges : (EMPTY_LIST as EdgeProps[]);

  const { current } = ref;
  const {
    x: offsetX,
    y: offsetY,
    width,
    height,
  } = current !== null
    ? current.getBoundingClientRect()
    : {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

  React.useEffect(() => {
    window.addEventListener('resize', forceUpdate);
    return () => window.removeEventListener('resize', forceUpdate);
  }, []);

  const inverse = React.useMemo(() => {
    if (offsetX === null || offsetY === null) {
      return null;
    }
    return invertWithOffset(mat4.create(), transform, [offsetX, offsetY]);
  }, [transform, offsetX, offsetY]);

  const invert = React.useCallback(
    (x: ReadonlyVec2) => {
      if (inverse === null) {
        return vec2.clone(x);
      } else {
        return vec2.transformMat4(vec2.create(), x, inverse);
      }
    },
    [inverse],
  );

  const onHandleDataChange = React.useCallback(
    (
      data: Readonly<HandleProps & HandleData>,
      element: Readonly<Element | null>,
    ) => {
      forceUpdate();
      const { id } = data;
      if (element === null) {
        handleElements.delete(id);
      } else {
        handleElements.set(id, [data, element]);
      }
    },
    [],
  );

  return (
    <div
      ref={(e) => {
        if (current === null) {
          forceUpdate();
        }
        ref.current = e;
      }}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}>
      <svg
        viewBox={`${0} ${0} ${width} ${height}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: edgesZ,
        }}>
        <Edges
          Edge={Edge}
          edges={edges}
          invert={invert}
          transform={transform}
          handleElements={handleElements}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: 'visible',
          transform: mat4ToTransformMatrix(transform),
          zIndex: nodesZ,
        }}>
        <Nodes
          Node={Node}
          Handle={Handle}
          nodes={nodes}
          onHandleDataChange={onHandleDataChange}
        />
      </div>
    </div>
  );
}

export default Diagram;
