import type { LineCoordinates } from '../../interfaces/LineCoordinates'
import type { VertexCoordinates } from '../../interfaces/VertexCoordinates'
import { splitLine } from '../geometry/geometry'

export const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2 * Math.PI)
    ctx.fill()
}

export const drawSegment = (
    ctx: CanvasRenderingContext2D,
    { startX, startY, endX, endY }: LineCoordinates,
    color: string = 'black',
    lineWidth: number = 1
) => {
    ctx.save()
    ctx.beginPath() // Start a new path
    ctx.moveTo(startX, startY) // Move the pen to (30, 50)
    ctx.lineTo(endX, endY) // Draw a line to (150, 100)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke() // Render the path
    ctx.restore()
}

export const drawPoint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string = 'red',
    size: number = 1
) => {
    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.restore()
}

// const drawPointsOnSegment = (
//     ctx: any,
//     { startX, startY, endX, endY }: LineCoordinates
// ) => {}

export const drawPolygon = (
    ctx: CanvasRenderingContext2D,
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

export function drawLines({
    ctx,
    lines,

    pointSize,
    colors,
}: {
    ctx: CanvasRenderingContext2D
    lines: VertexCoordinates[][]

    pointSize: number
    colors: string[]
}) {
    lines.forEach((line: any, index) => {
        drawSegment(
            ctx,
            {
                startX: line[0].x,
                startY: line[0].y,
                endX: line[1].x,
                endY: line[1].y,
            },
            colors[index],
            4
        )
        // const pointSize = 8
        const pointSizeShift = pointSize / 2
        const startPointX = line[0].x - pointSizeShift
        const startPointY = line[0].y - pointSizeShift
        const endPointX = line[1].x - pointSizeShift
        const endPointY = line[1].y - pointSizeShift

        drawPoint(ctx, startPointX, startPointY, colors[index], pointSize)
        drawPoint(ctx, endPointX, endPointY, colors[index], pointSize)
    })
}

export function drawPointsOnSegments({
    ctx,
    lines,
    pointSize = 8,
    segments,
    segmentLength,
    colors,
}: {
    ctx: CanvasRenderingContext2D
    lines: VertexCoordinates[][]
    pointSize?: number
    segments?: number
    segmentLength?: number
    colors: string[]
}) {
    lines.forEach((line: VertexCoordinates[], index) => {
        const lineSegmentPoints = splitLine({
            start: line[0],
            end: line[1],
            segments,
            segmentLength,
        })
        // console.log('line segment points')
        // console.log(lineSegmentPoints)

        const pointSizeShift = pointSize / 2

        lineSegmentPoints?.forEach((point: VertexCoordinates) => {
            const startPointX = point.x - pointSizeShift
            const startPointY = point.y - pointSizeShift

            drawPoint(ctx, startPointX, startPointY, colors[index], pointSize)
        })
    })
}
