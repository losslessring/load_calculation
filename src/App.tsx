import { DxfParser } from 'dxf-parser'
import { useState } from 'react'
import Canvas from './components/Canvas'
import { linesTest } from './utils/geometry/lines'
import { polygonsTest } from './utils/geometry/polygons'

function App() {
    const [lines, setLines] = useState<any>(null)
    const [polygons, setPolygons] = useState<any>(null)

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0]
        const fileData = await file.text()

        const parser = new DxfParser()

        const drawing = parser.parseSync(fileData)
        console.log(drawing)

        // const drawingEntities = drawing?.entities
        const lines = drawing?.blocks['Контуры'].entities

        if (lines) {
            const linesCoordinates: any = lines.reduce(
                (acc, currentEntity: any): any => {
                    if (currentEntity.type === 'LINE') {
                        const lineVertices = currentEntity.vertices.map(
                            (vertices: {
                                x: number
                                y: number
                                z: number
                            }) => ({
                                x: vertices.x,
                                y: vertices.y,
                            })
                        )
                        return [...acc, lineVertices]
                    } else {
                        return acc
                    }
                },
                []
            )

            setLines(linesCoordinates)

            const polygons = drawing?.entities
            // console.log('polygons:')
            // console.log(polygons)

            if (polygons) {
                const polygonsCoordinates: any = polygons.reduce(
                    (acc, currentEntity: any): any => {
                        if (currentEntity.type === 'LWPOLYLINE') {
                            const polygonVertices = currentEntity.vertices.map(
                                (vertices: { x: number; y: number }) => ({
                                    x: vertices.x,
                                    y: vertices.y,
                                })
                            )
                            return [...acc, polygonVertices]
                        } else {
                            return acc
                        }
                    },
                    []
                )
                // console.log('polygons coordinates:')
                // console.log(polygonsCoordinates)
                setPolygons(polygonsCoordinates)
            }
        }

        try {
        } catch (error) {
            console.log(e)
        }
    }

    return (
        <>
            <h3>Load calculation</h3>
            <div>
                <input type="file" onChange={handleFileChange} />
            </div>
            <div>
                <Canvas lines={linesTest} polygons={polygonsTest} />
            </div>
        </>
    )
}

export default App
