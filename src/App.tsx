import { DxfParser } from 'dxf-parser'
import { useState } from 'react'
import Canvas from './components/Canvas'

function App() {
    const [lines, setLines] = useState<any>(null)

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0]
        const fileData = await file.text()

        const parser = new DxfParser()

        const drawing = parser.parseSync(fileData)
        // console.log(drawing?.entities)

        const drawingEntities = drawing?.entities

        if (drawingEntities) {
            // console.log(drawingEntities)

            const linesCoordinates: any = drawingEntities.reduce(
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
                    }
                },
                []
            )
            // console.log(linesCoordinates)
            setLines(linesCoordinates)
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
                <Canvas lines={lines} />
            </div>
        </>
    )
}

export default App
