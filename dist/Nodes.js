import React from 'react';
function Nodes({ Node, Handle, nodes, onHandleDataChange, }) {
    const Handler = React.useMemo(() => (props) => (React.createElement(Handle, Object.assign({}, props, { onElementChange: onHandleDataChange.bind(undefined, props) }))), [onHandleDataChange]);
    return (React.createElement(React.Fragment, null, nodes.map((nodeProps) => {
        return React.createElement(Node, Object.assign({ key: nodeProps.id, Handler: Handler }, nodeProps));
    })));
}
export default React.memo(Nodes);
//# sourceMappingURL=Nodes.js.map