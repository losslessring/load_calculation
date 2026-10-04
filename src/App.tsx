import { DxfParser } from 'dxf-parser'
import { useState } from 'react'
import Canvas from './components/Canvas'

function App() {
    const [lines, setLines] = useState<any>(null)
    const [polygons, setPolygons] = useState<any>(null)
    const [scaleFactor, setScaleFactor] = useState(20)
    const [segmentLength, setSegmentLength] = useState(20)
    const [distributedLoad, setDistributedLoad] = useState(200)

    const [showLoadDistribution, setShowLoadDistribution] = useState(true)

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
            <h3>Сбор нагрузок</h3>
            <div>
                <input type="file" onChange={handleFileChange} />
            </div>
            <div>
                <label htmlFor="disturbel_load">
                    Распределенная нагрузка {distributedLoad} {}
                </label>
                <input
                    type="number"
                    id="disturbel_load"
                    name="disturbel_load"
                    min={0}
                    defaultValue={200}
                    onChange={(e) => {
                        if (isNaN(Number(e.target.value))) {
                            return
                        }
                        if (!Number(e.target.value)) {
                            return
                        }
                        if (Number(e.target.value) < 0) {
                            return
                        }

                        setDistributedLoad(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                <label htmlFor="scale">
                    Масштаб делить на {scaleFactor} {}
                </label>
                <input
                    type="number"
                    id="scale"
                    name="scale"
                    min={1}
                    defaultValue={20}
                    onChange={(e) => {
                        if (isNaN(Number(e.target.value))) {
                            return
                        }
                        if (!Number(e.target.value)) {
                            return
                        }
                        if (Number(e.target.value) < 4) {
                            return
                        }

                        setScaleFactor(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                <label htmlFor="segment_length">
                    Длина сегмента {segmentLength} {}
                </label>
                <input
                    type="number"
                    id="segment_length"
                    name="segment_length"
                    min={1}
                    defaultValue={20}
                    onChange={(e) => {
                        if (isNaN(Number(e.target.value))) {
                            return
                        }
                        if (!Number(e.target.value)) {
                            return
                        }
                        if (Number(e.target.value) < 4) {
                            return
                        }
                        setSegmentLength(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                <label>
                    Показать распределение нагрузки
                    <input
                        type="checkbox"
                        name="load_distribution_checkbox"
                        checked={showLoadDistribution}
                        onChange={(e) => {
                            setShowLoadDistribution(e.target.checked)
                        }}
                    />
                </label>
            </div>
            <div>
                {/* <Canvas lines={linesTest} polygons={polygonsTest} /> */}
                <Canvas
                    lines={lines}
                    polygons={polygons}
                    scaleFactor={scaleFactor}
                    segmentLength={segmentLength}
                    distributedLoad={distributedLoad}
                    showLoadDistribution={showLoadDistribution}
                />
            </div>
        </>
    )
}

export default App
