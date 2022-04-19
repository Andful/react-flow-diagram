/// <reference types="react" />
import { ReadonlyMat4, vec2 } from 'gl-matrix';
import { EdgeComponentType, HandleId, EdgeData, HandleData } from './componentTypes';
export interface EdgesProps<EdgeProps extends EdgeData, HandleProps extends HandleData> {
    Edge: EdgeComponentType<EdgeProps, HandleProps>;
    handleElements: Readonly<Map<HandleId, [HandleProps, Element]>>;
    edges: Readonly<EdgeProps[]>;
    transform: ReadonlyMat4;
    invert: (p: vec2) => vec2;
}
declare function Edges<EdgeProps extends EdgeData, HandleProps extends HandleData>({ handleElements, edges, invert, transform, Edge, }: EdgesProps<EdgeProps, HandleProps>): JSX.Element;
export default Edges;
//# sourceMappingURL=Edges.d.ts.map