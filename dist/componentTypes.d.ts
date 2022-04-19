import React from 'react';
import { vec2 } from 'gl-matrix';
export declare type NodeId = string;
export interface NodeData {
    id: NodeId;
}
export interface NodeAdditionalData<HProps extends HandleData> {
    Handler: HandlerComponentType<HProps>;
}
export declare type NodeComponentType<Props extends NodeData, HProps extends HandleData> = React.VFC<Props & NodeAdditionalData<HProps>>;
export declare type EdgeId = string;
export declare type EdgeEndpointType = {
    endpointType: 'handle-id';
    id: HandleId;
} | {
    endpointType: 'client-space';
    position: vec2;
    id: string;
} | {
    endpointType: 'svg-space';
    position: vec2;
    id: string;
};
export interface EdgeData {
    source: EdgeEndpointType;
    target: EdgeEndpointType;
}
export interface EdgePropsAddition<HProps extends HandleData> {
    sourceProps: HProps | null;
    sourcePosition: vec2;
    targetProps: HProps | null;
    targetPosition: vec2;
}
export declare type EdgeComponentType<Props extends EdgeData, HProps extends HandleData> = React.FC<Props & EdgePropsAddition<HProps>>;
export declare type HandleId = string;
export interface HandleData {
    id: HandleId;
}
export interface HandlePropsAddition {
    onElementChange: (element: Element | null) => void;
}
export declare type HandleComponentType<Props extends HandleData> = React.FC<Props & HandlePropsAddition>;
export declare type HandlerComponentType<Props extends HandleData> = React.FC<Props>;
//# sourceMappingURL=componentTypes.d.ts.map