import { useEffect, useRef } from 'react'
import type { VertexCoordinates } from '../interfaces/VertexCoordinates'
import { colors } from '../utils/colors/colors'
import { drawPoint, drawSegment } from '../utils/draw/draw'
import { createLines, scanlinePoly } from '../utils/draw/fill.js'

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
        const shiftY = 500

        lines?.forEach((line: VertexCoordinates[], index) => {
            drawSegment(
                ctx,
                {
                    startX: line[0].x / scaleFactor,
                    startY: line[0].y / scaleFactor - shiftY,
                    endX: line[1].x / scaleFactor,
                    endY: line[1].y / scaleFactor - shiftY,
                },
                colors[index],
                4
            )
            const pointSize = 8
            const pointSizeShift = pointSize / 2
            const startPointX = line[0].x / scaleFactor - pointSizeShift
            const startPointY =
                line[0].y / scaleFactor - shiftY - pointSizeShift
            const endPointX = line[1].x / scaleFactor - pointSizeShift
            const endPointY = line[1].y / scaleFactor - shiftY - pointSizeShift

            drawPoint(ctx, startPointX, startPointY, colors[index], pointSize)
            drawPoint(ctx, endPointX, endPointY, colors[index], pointSize)
        })
        console.log('lines')
        console.log(lines)
        console.log('polygons')
        console.log(polygons)

        // const polygonToFill = [
        //     {
        //         x: 0,
        //         y: 9500,
        //     },
        //     {
        //         x: 3000,
        //         y: 9500,
        //     },
        //     {
        //         x: 3000,
        //         y: 0,
        //     },
        //     {
        //         x: 0,
        //         y: 0,
        //     },
        //     {
        //         x: 0,
        //         y: 9500,
        //     },
        // ]

        const polygonToFill = [
            {
                x: 0 / scaleFactor,
                y: 9500 / scaleFactor - shiftY / scaleFactor - shiftY,
            },
            {
                x: 3000 / scaleFactor,
                y: 9500 / scaleFactor - shiftY,
            },
            {
                x: 3000 / scaleFactor,
                y: 0 / scaleFactor - shiftY,
            },
            {
                x: 0 / scaleFactor,
                y: 0 / scaleFactor - shiftY,
            },
            {
                x: 0 / scaleFactor,
                y: 9500 / scaleFactor - shiftY,
            },
        ]
        const fillLines = createLines([])
        console.log('fill lines')

        const P2 = (x = 0, y = 0) => ({ x, y })
        const L2 = (p1 = P2(), p2 = P2()) => ({
            p1,
            p2,
            slope: (p2.x - p1.x) / (p2.y - p1.y),
        })

        fillLines.addLine({
            ...L2(
                {
                    x: 0 / scaleFactor,
                    y: 9500 / scaleFactor - shiftY,
                },
                {
                    x: 3000 / scaleFactor,
                    y: 9500 / scaleFactor - shiftY,
                }
            ),
            color: 'red',
        })
        fillLines.addLine({
            ...L2(
                {
                    x: 3000 / scaleFactor,
                    y: 9500 / scaleFactor - shiftY,
                },
                {
                    x: 3000 / scaleFactor,
                    y: 0 / scaleFactor - shiftY,
                }
            ),
            color: 'green',
        })
        fillLines.addLine({
            ...L2(
                {
                    x: 3000 / scaleFactor,
                    y: 0 / scaleFactor - shiftY,
                },
                {
                    x: 0 / scaleFactor,
                    y: 0 / scaleFactor - shiftY,
                }
            ),
            color: 'blue',
        })
        fillLines.addLine({
            ...L2(
                {
                    x: 0 / scaleFactor,
                    y: 0 / scaleFactor - shiftY,
                },
                {
                    x: 0 / scaleFactor,
                    y: 9500 / scaleFactor - shiftY,
                }
            ),
            color: 'yellow',
        })
        console.log(fillLines)
        scanlinePoly(ctx, fillLines, '#F00')
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
