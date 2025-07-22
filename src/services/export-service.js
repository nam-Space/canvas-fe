import { saveAs } from "file-saver";

export function exportAsJson(canvas, fileName = "FileName") {
    if (!canvas) return;
    try {
        const canvasData = canvas.toJSON(["id", "filters"])
        const jsonString = JSON.stringify(canvasData, null, 2)
        const canvasJsonBlob = new Blob([jsonString], { type: 'application/json' })
        saveAs(canvasJsonBlob, `${fileName}.json`)
    } catch (e) {
        return false;
    }
}