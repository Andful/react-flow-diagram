import React from 'react';
const Edge = ({ sourcePosition, targetPosition, }) => {
    const [x1, y1] = sourcePosition;
    const [x2, y2] = targetPosition;
    return (React.createElement(React.Fragment, null,
        React.createElement("line", Object.assign({}, { x1, x2, y1, y2, stroke: 'black', strokeWidth: 2 }))));
};
export default Edge;
//# sourceMappingURL=DefaultEdge.js.map