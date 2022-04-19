import { ReadonlyMat4, vec2 } from 'gl-matrix';
import React from 'react';
import { mat4ToTransformMatrix } from './util';
import {
  EdgeComponentType,
  HandleId,
  EdgeData,
  HandleData,
  EdgeEndpointType,
} from './componentTypes';

export interface EdgesProps<
  EdgeProps extends EdgeData,
  HandleProps extends HandleData,
> {
  Edge: EdgeComponentType<EdgeProps, HandleProps>;
  handleElements: Readonly<Map<HandleId, [HandleProps, Element]>>;
  edges: Readonly<EdgeProps[]>;
  transform: ReadonlyMat4;
  invert: (p: vec2) => vec2;
}

function computePosition(element: Element, invert: (p: vec2) => vec2): vec2 {
  const { x, y, width, height } = element.getBoundingClientRect();

  return invert([x + width / 2, y + height / 2]);
}

function compareMaps<ID, T>(
  map1: Map<ID, T>,
  map2: Map<ID, T>,
  differs: (id: ID, t1: T, t2: T) => void,
  missingInMap1: (id: ID, t2: T) => void,
  missingInMap2: (id: ID, t1: T) => void,
) {
  const keys1 = new Set(map1.keys());
  const keys2 = new Set(map1.keys());
  const intersection = new Set([...keys1].filter((k) => keys2.has(k)));
  const inKeys1Only = new Set([...keys1].filter((k) => !keys2.has(k)));
  const inKeys2Only = new Set([...keys2].filter((k) => !keys1.has(k)));

  for (const k of intersection) {
    const data1 = map1.get(k) as T;
    const data2 = map2.get(k) as T;
    if (data1 !== data2) {
      differs(k, data1, data2);
    }
  }

  for (const k of inKeys1Only) {
    const data1 = map1.get(k) as T;
    missingInMap2(k, data1);
  }

  for (const k of inKeys2Only) {
    const data2 = map2.get(k) as T;
    missingInMap1(k, data2);
  }
}

function getHandleData<HandleProps>(
  invert: (p: vec2) => vec2,
  handlePositions: Map<HandleId, [HandleProps, vec2]>,
  eep: EdgeEndpointType,
): [HandleProps | null, vec2] | undefined {
  if (eep.endpointType === 'handle-id') {
    return handlePositions.get(eep.id);
  } else if (eep.endpointType === 'client-space') {
    return [null, invert(eep.position)];
  } else if (eep.endpointType === 'svg-space') {
    return [null, eep.position];
  } else {
    return undefined;
  }
}

function Edges<EdgeProps extends EdgeData, HandleProps extends HandleData>({
  handleElements,
  edges,
  invert,
  transform,
  Edge,
}: EdgesProps<EdgeProps, HandleProps>): JSX.Element {
  const handleElementsComparison = React.useMemo<
    Map<HandleId, [HandleProps, Element]>
  >(() => new Map(), []);
  const handlePositions = React.useMemo<Map<HandleId, [HandleProps, vec2]>>(
    () => new Map(),
    [],
  );

  const addInMap = React.useCallback(
    (id: HandleId, data: [HandleProps, Element]) => {
      handleElementsComparison.set(id, data);
      const [props, element] = data;
      const position = computePosition(element, invert);
      handlePositions.set(id, [props, position]);
    },
    [invert],
  );

  const removeInMap = React.useCallback((id: HandleId) => {
    handleElementsComparison.delete(id);
    handlePositions.delete(id);
  }, []);

  compareMaps(
    handleElements,
    handleElementsComparison,
    addInMap,
    removeInMap,
    addInMap,
  );

  return (
    <g style={{ transform: mat4ToTransformMatrix(transform) }}>
      {edges.map((props) => {
        const { source, target } = props;

        const [sourceData, targetData] = [
          getHandleData(invert, handlePositions, source),
          getHandleData(invert, handlePositions, target),
        ];
        if (sourceData === undefined || targetData === undefined) {
          return undefined;
        }

        const [[sourceProps, sourcePosition], [targetProps, targetPosition]] = [
          sourceData,
          targetData,
        ];

        return (
          <Edge
            key={`${source.id}-${target.id}`}
            sourceProps={sourceProps}
            sourcePosition={sourcePosition}
            targetProps={targetProps}
            targetPosition={targetPosition}
            {...props}
          />
        );
      })}
    </g>
  );
}

export default Edges;
