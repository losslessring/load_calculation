import type { VertexCoordinates } from '../../interfaces/VertexCoordinates'
import { slopeCalculation } from '../geometry/geometry'
import { createLines, scanlinePoly } from './fill'

export function fillPolygons({
    ctx,
    polygons,
    coloredLines,
    alpha,
    calculatePixelColor,
}: {
    ctx: CanvasRenderingContext2D
    polygons: VertexCoordinates[][]
    coloredLines: any
    alpha: number
    calculatePixelColor: Function
}) {
    const pixelData = polygons.map((polygon) => {
        const polygonToFill = polygon.map((point, index, array) => {
            const isLastElement = index < array.length - 1

            return isLastElement
                ? slopeCalculation(point, array[index + 1])
                : slopeCalculation(point, array[0])
        })

        console.log('polygons to fill')
        console.log(polygonToFill)
        const fillLines = createLines([])
        console.log('fill lines')

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
