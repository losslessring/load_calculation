import { DxfParser } from 'dxf-parser'
import { useState } from 'react'
import Canvas from './components/Canvas'

function App() {
    const [lines, setLines] = useState<any>(null)
    const [polygons, setPolygons] = useState<any>(null)
    const [scaleFactor, setScaleFactor] = useState(20)
    const [segmentLength, setSegmentLength] = useState(20)

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0]
        const fileData = await file.text()

        const parser = new DxfParser()

        const drawing = parser.parseSync(fileData)
        console.log(drawing)

        // const drawingEntities = drawing?.entities
        //const lines = drawing?.blocks['Контуры'].entities
        const lines = drawing?.entities

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
                <input
                    type="range"
                    id="scale"
                    name="scale"
                    min={4}
                    max={100}
                    step={1}
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                />
                <label htmlFor="scale">Масштаб делить на </label>
                <input
                    type="number"
                    min={4}
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                />
            </div>
            <div>
                <input
                    type="range"
                    id="segment_length"
                    name="segment_length"
                    min={1}
                    max={100}
                    step={1}
                    value={segmentLength}
                    onChange={(e) => setSegmentLength(Number(e.target.value))}
                />
                <label htmlFor="segment_length">Длина сегмента </label>
                <input
                    type="number"
                    min={1}
                    value={segmentLength}
                    onChange={(e) => setSegmentLength(Number(e.target.value))}
                />
            </div>
            <div>
                {/* <Canvas lines={linesTest} polygons={polygonsTest} /> */}
                <Canvas
                    lines={lines}
                    polygons={polygons}
                    scaleFactor={scaleFactor}
                    segmentLength={segmentLength}
                />
            </div>
        </>
    )
}

export default App
