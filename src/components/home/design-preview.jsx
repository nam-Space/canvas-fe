"use client";

import { useEffect, useRef, useState } from "react";

const DesignPreview = ({ design }) => {
    const [canvasId] = useState(`canvas-${design._id}-${Date.now()}`);
    const fabricCanvasRef = useRef(null);

    useEffect(() => {
        if (!design.canvasData) return;

        const timer = setTimeout(async () => {
            try {
                if (
                    fabricCanvasRef.current &&
                    typeof fabricCanvasRef.current.dispose === "function"
                ) {
                    try {
                        fabricCanvasRef.current.dispose();
                        fabricCanvasRef.current = null;
                    } catch (e) {
                        console.error("Error while disposing canvas");
                        return;
                    }
                }

                const fabric = await import("fabric");
                const canvasElement = document.getElementById(canvasId);

                if (!canvasElement) return;

                const designPreviewCanvas = new fabric.StaticCanvas(canvasId, {
                    width: 5000,
                    height: 5000,
                    renderOnAddRemove: true,
                });

                fabricCanvasRef.current = designPreviewCanvas;

                let canvasData;

                try {
                    canvasData =
                        typeof design.canvasData === "string"
                            ? JSON.parse(design.canvasData)
                            : design.canvasData;
                } catch (e) {
                    console.error("Error parsing canvas data");
                    return;
                }

                if (canvasData.background) {
                    designPreviewCanvas.backgroundColor = canvasData.background;
                    designPreviewCanvas.requestRenderAll();
                }

                designPreviewCanvas.loadFromJSON(canvasData, () => {
                    designPreviewCanvas.requestRenderAll();
                });
            } catch (e) {
                console.error("Error rendering design preview data");
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (
                fabricCanvasRef.current &&
                typeof fabricCanvasRef.current.dispose === "function"
            ) {
                try {
                    fabricCanvasRef.current.dispose();
                    fabricCanvasRef.current = null;
                } catch (e) {
                    console.error("Error while disposing canvas");
                }
            }
        };
    }, [design?._id, canvasId]);

    return <canvas id={canvasId} className="w-full h-full object-cover" />;
};

export default DesignPreview;
