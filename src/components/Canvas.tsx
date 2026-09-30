import { useEffect, useRef } from 'react'
import type { VertexCoordinates } from '../interfaces/VertexCoordinates'
import { colors } from '../utils/colors/colors'
import { drawLines, drawPointsOnSegments } from '../utils/draw/draw'
import { fillPolygons } from '../utils/draw/fillPolygons'
import { splitLine } from '../utils/geometry/geometry.js'

export default function Canvas({
    lines,
    polygons,
}: {
    lines: VertexCoordinates[][]
    polygons: VertexCoordinates[][]
}) {
    const ref = useRef(null)

    useEffect(() => {
        const canvas = ref.current
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas?.getContext('2d')

        ctx.scale(1, -1)

        const scaleFactor = 25
        const shiftX = 0
        const shiftY = 500

        const transformedLines = lines.map((line, index) => {
            return [
                {
                    x: line[0].x / scaleFactor - shiftX,
                    y: line[0].y / scaleFactor - shiftY,
                },
                {
                    x: line[1].x / scaleFactor - shiftX,
                    y: line[1].y / scaleFactor - shiftY,
                },
            ]
        })

        console.log('transformed lines')
        console.log(transformedLines)

        drawLines({
            ctx,
            lines: transformedLines,
            pointSize: 8,
            colors,
        })

        console.log('lines')
        console.log(lines)

        const coloredLines = transformedLines.map((line, index) => ({
            p1: {
                x: line[0].x,
                y: line[0].y,
            },
            p2: {
                x: line[1].x,
                y: line[1].y,
            },
            color: colors[index],
        }))

        console.log('colored lines')
        console.log(coloredLines)

        console.log('polygons')
        console.log(polygons)

        const lineSegmentPoints = transformedLines.map((line: any, index) => {
            return splitLine({
                start: line[0],
                end: line[1],
                segments: undefined,
                segmentLength: 60,
            })
        })
        console.log('line segment points')
        console.log(lineSegmentPoints)

        drawPointsOnSegments({
            ctx,
            lines: transformedLines,
            pointSize: 8,
            segments: undefined,
            segmentLength: 60,
            colors,
        })

        fillPolygons({
            ctx,
            polygons,
            scaleFactor,
            shiftX,
            shiftY,
            coloredLines,
            alpha: 0.75,
        })
    }, [lines])
    return (
        <canvas
            className="drawing-canvas"
            width="800"
            height="800"
            ref={ref}
        ></canvas>
    )
}
