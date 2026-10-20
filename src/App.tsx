import { DxfParser } from 'dxf-parser'
import { useState } from 'react'
import Canvas from './components/Canvas'

export enum ShowPoint {
    Heatmap = 'HEATMAP',
    Color = 'COLOR',
    Nothing = 'NOTHING',
}

export enum ShowNumericValue {
    LinearLoad = 'LINEAR_LOAD',
    Ordinate = 'ORDINATE',
    Nothing = 'NOTHING',
}

function App() {
    const numericValueLabels: Record<ShowNumericValue, string> = {
        [ShowNumericValue.LinearLoad]: 'линейная нагрузка на балку [кг/м]',
        [ShowNumericValue.Ordinate]: 'ордината [мм]',
        [ShowNumericValue.Nothing]: 'Не отображать',
    }

    const pointLabels: Record<ShowPoint, string> = {
        [ShowPoint.Heatmap]: 'Тепловая карта',
        [ShowPoint.Color]: 'Цвет балки',
        [ShowPoint.Nothing]: 'Не отображать',
    }

    const [lines, setLines] = useState<any>(null)
    const [polygons, setPolygons] = useState<any>(null)
    const [scaleFactor, setScaleFactor] = useState(20)
    const [segmentLength, setSegmentLength] = useState(20)
    const [distributedLoad, setDistributedLoad] = useState(200)

    const [showLoadDistribution, setShowLoadDistribution] = useState(true)

    const [showOnlyNPoint, setShowOnlyNPoint] = useState(1)
    const [startCalculation, setStartCalculation] = useState(false)
    const [showValue, setShowValue] = useState<ShowNumericValue>(
        ShowNumericValue.LinearLoad
    )

    const [showPoint, setShowPoint] = useState<ShowPoint>(ShowPoint.Heatmap)

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
            <h4>
                Приведение равномерно распределённой нагрузки на перекрытие
                [кг/м2] <br />к линейным нагрузкам на балки [кг/м]
            </h4>
            <div>
                <input type="file" onChange={handleFileChange} />
            </div>
            <dl className="controls">
                <dt>
                    <label htmlFor="distributed_load">
                        Распределённая нагрузка на перекрытие [кг/м2]&nbsp;
                        {'   '}
                    </label>
                </dt>
                <dd>
                    <input
                        type="number"
                        id="distributed_load"
                        name="distributed_load"
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
                </dd>
                <dt>
                    <label htmlFor="scale">Масштаб делить на {}</label>
                </dt>
                <dd>
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
                </dd>

                <dt>
                    <label htmlFor="segment_length">Длина сегмента {}</label>
                </dt>
                <dd>
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
                </dd>
                <dt>
                    <label htmlFor="load_distribution_checkbox">
                        Показать распределение нагрузки
                    </label>
                </dt>
                <dd>
                    <input
                        type="checkbox"
                        id="load_distribution_checkbox"
                        checked={showLoadDistribution}
                        onChange={(e) => {
                            setShowLoadDistribution(e.target.checked)
                        }}
                    />
                </dd>

                <dt>
                    <label>Показать значения</label>
                </dt>
                <dd>
                    <select
                        value={showValue}
                        onChange={(e) => {
                            setShowValue(e.target.value as ShowNumericValue)
                        }}
                    >
                        {Object.values(ShowNumericValue).map((f) => (
                            <option key={f} value={f}>
                                {numericValueLabels[f]}
                            </option>
                        ))}
                    </select>
                </dd>

                <dt>
                    <label>Показать точки</label>
                </dt>
                <dd>
                    <select
                        value={showPoint}
                        onChange={(e) => {
                            setShowPoint(e.target.value as ShowPoint)
                        }}
                    >
                        {Object.values(ShowPoint).map((f) => (
                            <option key={f} value={f}>
                                {pointLabels[f]}
                            </option>
                        ))}
                    </select>
                </dd>

                <dt>
                    <label htmlFor="scale">
                        Показывать значение каждой {showOnlyNPoint} точки
                    </label>
                </dt>
                <dd>
                    <input
                        type="number"
                        id="show_nth_point"
                        name="show_nth_point"
                        min={1}
                        defaultValue={1}
                        onChange={(e) => {
                            if (isNaN(Number(e.target.value))) {
                                return
                            }
                            if (!Number(e.target.value)) {
                                return
                            }
                            if (Number(e.target.value) < 1) {
                                return
                            }

                            setShowOnlyNPoint(Number(e.target.value))
                        }}
                    />
                </dd>
            </dl>
            <div className="calculate">
                <button
                    className="calculate-button"
                    onClick={() => setStartCalculation(true)}
                    disabled={startCalculation}
                >
                    Рассчитать
                </button>
            </div>

            <div>
                <Canvas
                    lines={lines}
                    polygons={polygons}
                    scaleFactor={scaleFactor}
                    segmentLength={segmentLength}
                    distributedLoad={distributedLoad}
                    showLoadDistribution={showLoadDistribution}
                    showOnlyNPoint={showOnlyNPoint}
                    showValue={showValue}
                    showPoint={showPoint}
                    startCalculation={startCalculation}
                    calculationTrigger={() => setStartCalculation(false)}
                />
            </div>
        </>
    )
}

export default App
