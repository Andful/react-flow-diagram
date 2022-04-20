import React, { useEffect } from 'react';
import { ReadonlyVec2 } from 'gl-matrix'

const patternWidth = 30;
const patternHeight = 30;

//patternUnits="userSpaceOnUse"

export interface BackgroundProps {
    offset: ReadonlyVec2,
    scale: number,
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void
}

export default function Background({offset, scale, onPointerMove}: BackgroundProps): JSX.Element {
    const [{ width, height }, setDimensions ] = React.useState<{
        width: number,
        height: number
    }>({ width: 0, height: 0});
    const ref = React.useRef<SVGSVGElement | null>(null);

    const onresize = React.useCallback(() => {
        const { current } = ref;
        if ( current !== null) {
            setDimensions({
                width: current.clientWidth,
                height: current.clientHeight
            })
        }
    }, []);

    useEffect(onresize, [])
    window.addEventListener('resize', onresize);

    return <svg
        onPointerMove={onPointerMove}
        style={{
            width: '100%',
            height: '100%',
        }}
        viewBox={`0 0 ${width} ${height}`}
        ref={ref}>
        <pattern
            id="pattern" 
            x={offset[0] % (patternWidth * scale)}
            y={offset[1] % (patternHeight * scale)}
            width={patternWidth * scale}
            height={patternHeight * scale}
            >
            <circle
                cx={scale}
                cy={scale}
                r={2 * scale}
                fill="lightgray"
                />
        </pattern>
        <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern)"
        />
    </svg>
}