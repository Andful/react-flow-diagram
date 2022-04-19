import React from 'react';
const DefaultComponent = ({ onElementChange, }) => (React.createElement("div", { ref: onElementChange, style: {
        width: 0,
        height: 0,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } },
    React.createElement("div", { style: {
            flex: '0 0 auto',
            width: '20px',
            height: '20px',
            backgroundColor: 'lightgray',
            borderRadius: '100%',
            border: '4px black solid',
            zIndex: 9,
        } })));
export default DefaultComponent;
//# sourceMappingURL=DefaultHandle.js.map