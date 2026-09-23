import { DxfParser } from 'dxf-parser'
import { useState } from 'react'

function App() {
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = async (e: any) => {
        // Access the selected file from the event
        // setSelectedFile(e.target.files[0])
        const file = e.target.files[0]
        const fileData = await file.text()
        const parser = new DxfParser()

        const dxf = parser.parseSync(fileData)
        console.log(dxf)
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
        </>
    )
}

export default App
