import { useEffect, useRef } from 'react'
import type { PointValue } from '../interfaces/PointValue.js'
import type { VertexCoordinates } from '../interfaces/VertexCoordinates'
import { colors } from '../utils/colors/colors'
import {
    drawColoredPointsFlat,
    drawLines,
    drawPointValues,
    heatmap,
} from '../utils/draw/draw'
import { fillPolygons } from '../utils/draw/fillPolygons.js'
import { distance, pDistance, splitLine } from '../utils/geometry/geometry.js'

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

        ctx.scale(1, 1)

        const scaleFactor = 15
        const shiftX = 0
        const shiftY = 0

        const segmentLength = 20

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

        const lineSegmentPoints = transformedLines
            .map((line: any, index) => {
                return splitLine({
                    start: line[0],
                    end: line[1],
                    segments: undefined,
                    segmentLength: segmentLength,
                })
            })
            .map((line: any, index) => {
                return line.map((point: VertexCoordinates) => {
                    return {
                        ...point,
                        // color: colors[Math.floor(Math.random() * 17)],
                        color: colors[index],
                    }
                })
            })

        console.log('line segment points')
        console.log(lineSegmentPoints)

        // drawPointsOnSegments({
        //     ctx,
        //     lines: transformedLines,
        //     pointSize: 8,
        //     segments: undefined,
        //     segmentLength: 60,
        //     colors,
        // })

        // drawColoredPoints(ctx, lineSegmentPoints, 8)

        const calculatePixelColor = (x: number, y: number) => {
            const closestLine = coloredLines.reduce(
                (accumulator, currentLine) => {
                    const currentDistance = pDistance(
                        x,
                        y,
                        currentLine.p1.x,
                        currentLine.p1.y,
                        currentLine.p2.x,
                        currentLine.p2.y
                    )
                    return currentDistance < accumulator.distance
                        ? {
                              distance: currentDistance,
                              color: currentLine.color,
                          }
                        : accumulator
                },
                { distance: Infinity, color: 'black' }
            )
            return closestLine
        }

        const coloredPoints = lineSegmentPoints.flat()
        // drawColoredPointsFlat(ctx, coloredPoints, 8, 'color')
        // drawPointIndexes(ctx, coloredPoints, 10, -20)

        console.log('colored points')
        console.log(coloredPoints)

        const calculatePixelColorByClosestSegmentPoint = (
            x: number,
            y: number
        ) => {
            const closestPoint = coloredPoints.reduce(
                (accumulator, currentPoint, currentIndex) => {
                    const currentDistance = distance(
                        x,
                        y,
                        currentPoint.x,
                        currentPoint.y
                    )
                    return currentDistance < accumulator.distance
                        ? {
                              pointIndex: currentIndex,
                              distance: currentDistance,
                              color: currentPoint.color,
                          }
                        : accumulator
                },
                { pointIndex: undefined, distance: Infinity, color: 'black' }
            )
            return closestPoint
        }

        const pixelData = fillPolygons({
            ctx,
            polygons,
            scaleFactor,
            shiftX,
            shiftY,
            coloredLines,
            alpha: 0.75,
            // calculatePixelColor: calculatePixelColor,
            calculatePixelColor: calculatePixelColorByClosestSegmentPoint,
        })

        console.log('pixel data')
        console.log(pixelData)
        const groupedPixelData = pixelData
            .flat()
            .reduce((acc: any, cur: any) => {
                acc[cur.pointIndex]
                    ? (acc[cur.pointIndex] = acc[cur.pointIndex] + 1)
                    : (acc[cur.pointIndex] = 1)
                return acc
            }, {})
        console.log('grouped pixel data')
        console.log(groupedPixelData)

        const groupedPixelDataArray = Object.entries(groupedPixelData).map(
            (point) => ({
                index: parseInt(point[0]),
                value: (point[1] as number) / segmentLength,
            })
        )
        console.log('grouped pixel data array')
        console.log(groupedPixelDataArray)

        const heatmapPixelData = heatmap(groupedPixelDataArray as PointValue[])
        console.log('heatmap pixel data')
        console.log(heatmapPixelData)

        const coloredPointsHeatmap = coloredPoints.map((point, index) => {
            return {
                ...point,
                heatmap: heatmapPixelData.find(
                    (pixelData) => pixelData.index === index
                )?.heatmap,

                value: groupedPixelDataArray.find(
                    (pixelData: any) => pixelData.index === index
                )?.value,
            }
        })
        console.log('colored points heatmap')
        console.log(coloredPointsHeatmap)
        drawColoredPointsFlat(ctx, coloredPointsHeatmap, 10, 'heatmap')
        drawPointValues(ctx, coloredPointsHeatmap, 'value', 0, 0)
    }, [lines])
    return (
        <canvas
            className="drawing-canvas"
            width="1600"
            height="1600"
            ref={ref}
        ></canvas>
    )
}
