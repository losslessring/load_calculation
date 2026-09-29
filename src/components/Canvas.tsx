import { useEffect, useRef } from 'react'
import type { VertexCoordinates } from '../interfaces/VertexCoordinates'
import { colors } from '../utils/colors/colors'
import { drawLines, drawPoint } from '../utils/draw/draw'
import { fillPolygons } from '../utils/draw/fillPolygons.js'
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

        const coloredLines = lines?.map((line, index) => ({
            p1: {
                x: line[0].x / scaleFactor,
                y: line[0].y / scaleFactor - shiftY,
            },
            p2: {
                x: line[1].x / scaleFactor,
                y: line[1].y / scaleFactor - shiftY,
            },
            color: colors[index],
        }))

        drawLines({
            ctx,
            lines,
            scaleFactor,
            shiftX,
            shiftY,
            pointSize: 8,
            colors,
        })

        console.log('lines')
        console.log(lines)
        console.log('colored lines')
        console.log(coloredLines)
        console.log('polygons')
        console.log(polygons)

        lines.forEach

        lines.forEach((line: any, index) => {
            const lineSegmentPoints = splitLine({
                start: line[0],
                end: line[1],
                // segments: 4,
                segmentLength: 600,
            })
            console.log('line segment points')
            console.log(lineSegmentPoints)

            const pointSize = 8
            const pointSizeShift = pointSize / 2

            lineSegmentPoints?.forEach((point) => {
                const startPointX = point.x / scaleFactor - pointSizeShift
                const startPointY =
                    point.y / scaleFactor - shiftY - pointSizeShift

                drawPoint(
                    ctx,
                    startPointX,
                    startPointY,
                    colors[index],
                    pointSize
                )
            })
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
