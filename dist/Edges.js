import React from 'react';
import { mat4ToTransformMatrix } from './util';
function computePosition(element, invert) {
    const { x, y, width, height } = element.getBoundingClientRect();
    return invert([x + width / 2, y + height / 2]);
}
function compareMaps(map1, map2, differs, missingInMap1, missingInMap2) {
    const keys1 = new Set(map1.keys());
    const keys2 = new Set(map1.keys());
    const intersection = new Set([...keys1].filter((k) => keys2.has(k)));
    const inKeys1Only = new Set([...keys1].filter((k) => !keys2.has(k)));
    const inKeys2Only = new Set([...keys2].filter((k) => !keys1.has(k)));
    for (const k of intersection) {
        const data1 = map1.get(k);
        const data2 = map2.get(k);
        if (data1 !== data2) {
            differs(k, data1, data2);
        }
    }
    for (const k of inKeys1Only) {
        const data1 = map1.get(k);
        missingInMap2(k, data1);
    }
    for (const k of inKeys2Only) {
        const data2 = map2.get(k);
        missingInMap1(k, data2);
    }
}
function getHandleData(invert, handlePositions, eep) {
    if (eep.endpointType === 'handle-id') {
        return handlePositions.get(eep.id);
    }
    else if (eep.endpointType === 'client-space') {
        return [null, invert(eep.position)];
    }
    else if (eep.endpointType === 'svg-space') {
        return [null, eep.position];
    }
    else {
        return undefined;
    }
}
function Edges({ handleElements, edges, invert, transform, Edge, }) {
    const handleElementsComparison = React.useMemo(() => new Map(), []);
    const handlePositions = React.useMemo(() => new Map(), []);
    const addInMap = React.useCallback((id, data) => {
        handleElementsComparison.set(id, data);
        const [props, element] = data;
        const position = computePosition(element, invert);
        handlePositions.set(id, [props, position]);
    }, [invert]);
    const removeInMap = React.useCallback((id) => {
        handleElementsComparison.delete(id);
        handlePositions.delete(id);
    }, []);
    compareMaps(handleElements, handleElementsComparison, addInMap, removeInMap, addInMap);
    return (React.createElement("g", { style: { transform: mat4ToTransformMatrix(transform) } }, edges.map((props) => {
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
        return (React.createElement(Edge, Object.assign({ key: `${source.id}-${target.id}`, sourceProps: sourceProps, sourcePosition: sourcePosition, targetProps: targetProps, targetPosition: targetPosition }, props)));
    })));
}
export default Edges;
//# sourceMappingURL=Edges.js.map