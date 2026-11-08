import { DxfParser } from 'dxf-parser'
import { useEffect, useRef, useState } from 'react'
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

    const [isInstructionDialogOpen, setInstructionDialogOpen] = useState(false)
    const instructionDialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (isInstructionDialogOpen) {
            instructionDialogRef.current?.showModal()
        } else {
            instructionDialogRef.current?.close()
        }
    }, [isInstructionDialogOpen])

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
            <h4 className="title">
                Приведение равномерно распределённой нагрузки на перекрытие
                [кг/м2] <br />к линейным нагрузкам на балки [кг/м]
            </h4>
            <button
                className="instruction-button"
                onClick={() => setInstructionDialogOpen(true)}
            >
                Инструкция
            </button>

            <dialog
                ref={instructionDialogRef}
                onClose={() => setInstructionDialogOpen(false)}
            >
                <div className="text-instruction">
                    <h4 tabIndex={-1} autoFocus>
                        Инструкция
                    </h4>
                    <p>
                        Для проведения расчета сначала необходимо сделать
                        чертеж.
                    </p>
                    <p>Чертеж должен состоять из балок и перекрытий.</p>
                    <p>
                        Балка моделируется в Autocad с помощью инструмента
                        Отрезок
                    </p>
                    <p>Рисование-&gt;Отрезок</p>
                    <img
                        src="/images/instruction/1_instruction_line.png"
                        alt="Отрезок"
                    />
                    <p>
                        Балка моделируется из двух точек, обозначающих начало и
                        конец балки.
                    </p>
                    <p>Сделаем балку с координатами x1:0 y1:0 и x2:2000 y2:0</p>
                    <img
                        src="/images/instruction/2_instruction_line_points.png"
                        alt="2 точки"
                    />
                    <p>
                        Нарисуем еще 3 отрезка, обозначающие балки с привязками
                        к концам отрезков. Каждая балка моделируется одним
                        отрезком.
                    </p>
                    <img
                        src="/images/instruction/3_instruction_4_lines.png"
                        alt="4 балки"
                    />
                    <p>
                        Смоделируем перекрытие. Перекрытие моделируется в
                        Autocad с помощью инструмента Полилиния.
                    </p>
                    <img
                        src="/images/instruction/4_instruction_polyline.png"
                        alt="Полилиния"
                    />
                    <p>
                        Прощелкаем по углам балок с привязкой к точкам.
                        Получится Полилиния, изображающая перекрытие.
                    </p>
                    <img
                        src="/images/instruction/5_instruction_polyline_done.png"
                        alt="Перекрытие сделано"
                    />
                    <p>Сохраним чертеж в формате DXF</p>
                    <img
                        src="/images/instruction/6_instruction_save_as_dxf.png"
                        alt="Сохраним в dxf"
                    />
                    <p>Загрузим полученный файл в расчетную программу</p>
                    <img
                        src="/images/instruction/7_instruction_load_file.png"
                        alt="Загрузим файл"
                    />
                    <p>Выберем файл</p>
                    <img
                        src="/images/instruction/8_instruction_select_file.png"
                        alt="Выберем файл"
                    />
                    <p>Далее следует установить расчетные значения</p>
                    <p>
                        <strong>
                            Распределённая нагрузка на перекрытие [кг/м2]
                        </strong>{' '}
                        - значение распределенной нагрузки на перекрытие
                    </p>
                    <p>
                        <strong>Масштаб делить на [значение]</strong> - если
                        чертеж отображается слишком мелко, то следует уменьшить
                        делитель. 4 - минимальное значение.
                    </p>
                    <p>
                        <strong>Длина сегмента</strong> - интервал между
                        расчетными срезами. Чем меньше, тем больше срезов.
                    </p>
                    <p>
                        <strong>Показать распределение нагрузки</strong> -
                        показать распределение нагрузки перекрытия на балки.
                        Каждая балка окрашена в свой цвет. На перекрытии
                        отображается закрашенными областями то, какая балка
                        забирает нагрузку.
                    </p>
                    <p>
                        <strong>Показать значения:</strong> линейная нагрузка на
                        балку [кг/м], ордината [мм], Не отображать
                    </p>
                    <p>
                        <strong>
                            Показать значения линейной нагрузки на балку в
                            [кг/м]
                        </strong>
                        , ординаты в [мм] или не отображать значения.
                    </p>
                    <p>
                        <strong>Показать точки:</strong> Тепловая карта, Цвет
                        балки, Не отображать
                        <p>
                            Показать точки с раскраской под тепловую карту -
                            синий минимальные значения, красный - максимальные.
                        </p>
                        <p>
                            Цвет балки - точки окрашены в цвет балки, к которой
                            принадлежат.
                        </p>
                        <p>Не отображать точки.</p>
                    </p>
                    <p>
                        Показывать значение каждой [значение] точки - Если длина
                        сегмента слишком маленькая, то отображаемые значения
                        могут слипаться. С помощью этой настройки можно
                        проредить отображение точек.
                    </p>
                    <p>
                        После выставления значений запустим расчет нажав кнопку
                        "Рассчитать".
                    </p>
                    <img
                        src="/images/instruction/9_instruction_set_up.png"
                        alt="Установка расчетных значений"
                    />

                    <p>
                        Со значением масштаба, установленным в 4, и с другими
                        настройками по умолчанию, получим такой расчет.
                    </p>
                    <img
                        src="/images/instruction/10_instruction_result.png"
                        alt="Готовый расчет"
                    />
                    <button onClick={() => setInstructionDialogOpen(false)}>
                        Close
                    </button>
                </div>
            </dialog>
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
