import { shapeDefinitions } from './shapes/shape-definitions'
import { createShape } from './shapes/shape-factory'


export const initializeFabric = async (canvasEl, containerEl) => {
    try {
        const { Canvas, PencilBrush } = await import('fabric')

        const canvas = new Canvas(canvasEl, {
            preserveObjectStacking: true,
            isDrawingMode: false,
            renderOnAddRemove: true
        })

        const brush = new PencilBrush(canvas)
        brush.color = '#000000'
        brush.width = 5
        canvas.freeDrawingBrush = brush

        return canvas
    } catch (e) {
        console.error('Failed to load fabric', e)
        return null
    }
}

export const centerCanvas = canvas => {
    if (!canvas || !canvas.wrapperEl) return

    const canvasWrapper = canvas.wrapperEl

    canvasWrapper.style.width = `${canvas.width}px`
    canvasWrapper.style.height = `${canvas.height}px`

    canvasWrapper.style.position = 'absolute'
    canvasWrapper.style.top = '50%'
    canvasWrapper.style.left = '50%'
    canvasWrapper.style.transform = 'translate(-50%, -50%)'
}

export const addShapeToCanvas = async (canvas, shapeType, customProps = {}) => {
    if (!canvas) return null;

    try {
        const fabricModule = await import('fabric')
        const shape = createShape(fabricModule, shapeType, shapeDefinitions, {
            left: 100,
            top: 100,
            ...customProps
        })
        if (shape) {
            shape.id = `${shapeType}-${Date.now()}`
            canvas.add(shape)
            canvas.renderAll()
            canvas.setActiveObject(shape)
            return shape
        }
    } catch (e) {
        console.error('Failed to load fabric', e)
        return null
    }
}

export const addTextToCanvas = async (canvas, text, options = {}, withBackground = false) => {
    if (!canvas) return null;

    try {
        const { IText } = await import('fabric')

        const defaultProps = {
            left: 100,
            top: 100,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#000000',
            padding: withBackground ? 10 : 0,
            textAlign: 'left',
            id: `text-${Date.now()}`
        }

        const textObj = new IText(text, {
            ...defaultProps,
            ...options
        })

        canvas.add(textObj)
        canvas.setActiveObject(textObj)
        canvas.renderAll()

        return textObj
    } catch (e) {
        console.error('Failed to load fabric', e)
        return null
    }
}