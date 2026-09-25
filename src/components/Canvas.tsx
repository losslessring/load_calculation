import { useEffect, useRef } from 'react'
import type { LineCoordinates } from '../interfaces/LineCoordinates'
import type { VertexCoordinates } from '../interfaces/VertexCoordinates'

export default function Canvas({
    lines,
    polygons,
}: {
    lines: VertexCoordinates[][]
    polygons: VertexCoordinates[][]
}) {
    const ref = useRef(null)

    const draw = (ctx: any) => {
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20, 0, 2 * Math.PI)
        ctx.fill()
    }

    const drawSegment = (
        ctx: any,
        { startX, startY, endX, endY }: LineCoordinates
    ) => {
        ctx.beginPath() // Start a new path
        ctx.moveTo(startX, startY) // Move the pen to (30, 50)
        ctx.lineTo(endX, endY) // Draw a line to (150, 100)
        ctx.stroke() // Render the path
    }

    const drawPolygon = (
        ctx: any,
        coordinates: VertexCoordinates[],
        fillColor: string
    ) => {
        // ctx.fillStyle = '#f00'
        ctx.fillStyle = fillColor
        ctx.beginPath()
        ctx.moveTo(coordinates[0].x, coordinates[0].y)
        //Draw lines from the second point in coordinates array

        ctx.lineTo(100, 50)
        ctx.lineTo(50, 100)
        ctx.lineTo(0, 90)
        ctx.closePath()
        ctx.fill()
    }

    useEffect(() => {
        const canvas = ref.current
        // @ts-ignore
        const context = canvas?.getContext('2d')

        context.scale(1, -1)

        const scaleFactor = 25
        const shift = 500
        lines?.forEach((line: VertexCoordinates[]) => {
            drawSegment(context, {
                startX: line[0].x / scaleFactor,
                startY: line[0].y / scaleFactor - shift,
                endX: line[1].x / scaleFactor,
                endY: line[1].y / scaleFactor - shift,
            })
        })
        console.log('lines')
        console.log(lines)
        console.log('polygons')
        console.log(polygons)
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
