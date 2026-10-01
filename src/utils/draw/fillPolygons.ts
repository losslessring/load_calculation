import type { VertexCoordinates } from '../../interfaces/VertexCoordinates'
import { createLines, scanlinePoly } from './fill'

export function fillPolygons({
    ctx,
    polygons,
    scaleFactor,
    shiftX,
    shiftY,
    coloredLines,
    alpha,
    calculatePixelColor,
}: {
    ctx: CanvasRenderingContext2D
    polygons: VertexCoordinates[][]
    scaleFactor: number
    shiftX: number
    shiftY: number
    coloredLines: any
    alpha: number
    calculatePixelColor: Function
}) {
    const pixelData = polygons.map((polygon) => {
        const polygonToFill = polygon
            .map((point) => ({
                x: point.x / scaleFactor - shiftX,
                y: point.y / scaleFactor - shiftY,
            }))
            .map((point, index, array) => {
                if (index < array.length - 1) {
                    return {
                        p1: { x: array[index].x, y: array[index].y },
                        p2: {
                            x: array[index + 1].x,
                            y: array[index + 1].y,
                        },
                        slope:
                            (array[index + 1].x - array[index].x) /
                            (array[index + 1].y - array[index].y),
                    }
                } else {
                    return {
                        p1: { x: array[index].x, y: array[index].y },
                        p2: { x: array[0].x, y: array[0].y },
                        slope:
                            (array[0].x - array[index].x) /
                            (array[0].y - array[index].y),
                    }
                }
            })

        console.log('polygons to fill')
        console.log(polygonToFill)
        const fillLines = createLines([])
        console.log('fill lines')

        // const P2 = (x = 0, y = 0) => ({ x, y })
        // const L2 = (p1: VertexCoordinates, p2: VertexCoordinates) => ({
        //     p1,
        //     p2,
        //     slope: (p2.x - p1.x) / (p2.y - p1.y),
        // })

        polygonToFill.forEach((line) => {
            fillLines.addLine(line)
        })

        console.log(fillLines)
        const polygonPixelData = scanlinePoly(
            ctx,
            fillLines,
            coloredLines,
            alpha,
            calculatePixelColor
        )
        return polygonPixelData
    })
    return pixelData
}
