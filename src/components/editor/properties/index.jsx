"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { fontFamilies } from "@/config";
import {
    cloneSelectedObject,
    deletedSelectedObject,
} from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import {
    Bold,
    Copy,
    FlipHorizontal,
    Italic,
    MoveDown,
    MoveUp,
    Trash,
    Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

const Properties = () => {
    const { canvas, setShowProperties, markAsModified } = useEditorStore();

    const [selectedObject, setSelectedObject] = useState(null);
    const [objectType, setObjectType] = useState("");
    const [commonProperties, setCommonProperties] = useState({
        opacity: 100,
        width: 0,
        height: 0,
        borderColor: "#000000",
        borderWidth: 0,
        borderStyle: "solid",
    });

    const [textProperties, setTextProperties] = useState({
        text: "",
        fontSize: 24,
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        underline: false,
        textColor: "#000000",
        textBackgroundColor: "#ffffff",
        letterSpacing: 0,
    });

    const [shapeProperties, setShapeProperties] = useState({
        fillColor: "#ffffff",
    });

    const [imageProperties, setImageProperties] = useState({
        filter: "none",
        blur: 0,
    });

    useEffect(() => {
        if (!canvas) return;

        const handleSelectionCreated = () => {
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                setSelectedObject(activeObject);

                const newProperties = {
                    borderStyle: "solid",
                };

                if (activeObject.strokeDashArray) {
                    if (
                        activeObject.strokeDashArray[0] === 5 &&
                        activeObject.strokeDashArray[1] === 5
                    ) {
                        newProperties.borderStyle = "dashed";
                    } else if (
                        activeObject.strokeDashArray[0] === 2 &&
                        activeObject.strokeDashArray[1] === 2
                    ) {
                        newProperties.borderStyle = "dotted";
                    } else {
                        newProperties.borderStyle = "solid";
                    }
                }

                //update common properties
                setCommonProperties({
                    ...commonProperties,
                    ...newProperties,
                    opacity: Math.round(activeObject.opacity * 100) || 100,
                    width: Math.round(activeObject.width * activeObject.scaleX),
                    height: Math.round(
                        activeObject.height * activeObject.scaleY
                    ),
                    borderColor: activeObject.stroke || "#000000",
                    borderWidth: activeObject.strokeWidth || 0,
                });

                if (activeObject.type === "i-text") {
                    setObjectType("text");
                    setTextProperties({
                        ...textProperties,
                        text: activeObject.text || "",
                        fontSize: activeObject.fontSize || 24,
                        fontFamily: activeObject.fontFamily || "Arial",
                        fontWeight: activeObject.fontWeight || "normal",
                        fontStyle: activeObject.fontStyle || "normal",
                        underline: activeObject.underline || false,
                        textColor: activeObject.fill || "#000000",
                        textBackgroundColor:
                            activeObject.backgroundColor || "#ffffff",
                        letterSpacing: activeObject.charSpacing || 0,
                    });
                } else if (activeObject.type === "image") {
                    setObjectType("image");

                    const newProps = {
                        filter: "none",
                        blur: 0,
                    };

                    if (activeObject?.filters?.length > 0) {
                        const filterObj = activeObject.filters[0];
                        if (filterObj.type === "Grayscale") {
                            newProps.filter = "grayscale";
                        } else if (filterObj.type === "Sepia") {
                            newProps.filter = "sepia";
                        } else if (filterObj.type === "Invert") {
                            newProps.filter = "invert";
                        } else if (filterObj.type === "Blur") {
                            newProps.filter = "blur";
                            newProps.blur = filterObj.blur * 100;
                        } else {
                            newProps.filter = "none";
                        }
                    }

                    setImageProperties({
                        ...imageProperties,
                        ...newProps,
                    });
                } else if (activeObject.type === "path") {
                    setObjectType("path");
                } else {
                    setObjectType("shape");

                    setShapeProperties({
                        ...shapeProperties,
                    });
                }
            }
        };

        const handleSelectionCleared = () => {
            setShowProperties(false);
        };

        const activeObject = canvas.getActiveObject();

        if (activeObject) {
            handleSelectionCreated();
        }

        canvas.on("selection:created", handleSelectionCreated);
        canvas.on("selection:updated", handleSelectionCreated);
        canvas.on("object:modified", handleSelectionCreated);
        canvas.on("selection:cleared", handleSelectionCleared);

        return () => {
            canvas.off("selection:created", handleSelectionCreated);
            canvas.off("selection:updated", handleSelectionCreated);
            canvas.off("object:modified", handleSelectionCreated);
            canvas.off("selection:cleared", handleSelectionCleared);
        };
    }, [canvas]);

    const updateObjectProperty = (property, val) => {
        if (!canvas || !selectedObject) return;

        selectedObject.set(property, val);
        canvas.renderAll();
        markAsModified();
    };

    const handleImageFilterChange = async (val) => {
        setImageProperties({
            ...imageProperties,
            filter: val,
        });

        if (!canvas || !selectedObject || selectedObject.type !== "image")
            return;

        try {
            const { filters } = await import("fabric");

            selectedObject.filters = [];

            switch (val) {
                case "grayscale":
                    selectedObject.filters.push(new filters.Grayscale());
                    break;
                case "sepia":
                    selectedObject.filters.push(new filters.Sepia());
                    break;
                case "invert":
                    selectedObject.filters.push(new filters.Invert());
                    break;
                case "blur":
                    selectedObject.filters.push(
                        new filters.Blur({ blur: imageProperties.blur / 100 })
                    );
                    break;
                case "none":
                default:
                    break;
            }

            selectedObject.applyFilters();
            canvas.renderAll();
            markAsModified();
        } catch (e) {
            console.error("Failed to apply filters");
        }
    };

    const handleBlurChange = async (val) => {
        const newBlurVal = val[0];
        setImageProperties({
            ...imageProperties,
            blur: newBlurVal,
        });

        if (
            !canvas ||
            !selectedObject ||
            selectedObject.type !== "image" ||
            imageProperties.filter !== "blur"
        ) {
            return;
        }

        try {
            const { filters } = await import("fabric");
            selectedObject.filters = [
                new filters.Blur({ blur: newBlurVal / 100 }),
            ];
            selectedObject.applyFilters();
            canvas.renderAll();
            markAsModified();
        } catch (e) {
            console.error("Error while applying blur", e);
        }
    };

    return (
        <div className="w-[280px] bg-white border-l border-gray-200 z-10">
            <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Properties</span>
                </div>
            </div>
            <div className="h-[calc(100%-96px)] overflow-auto p-4 space-y-6">
                <h3 className="text-sm font-medium">Size & Position</h3>
                {/* Width & Height */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className={"text-xs"}>Width</Label>
                        <input
                            className="h-9 px-3 border rounded-md flex items-center w-full"
                            value={commonProperties.width}
                            onChange={(e) => {
                                setCommonProperties({
                                    ...commonProperties,
                                    width: e.target.value,
                                });
                                updateObjectProperty(
                                    "scaleX",
                                    e.target.value / selectedObject.width
                                );
                                markAsModified();
                            }}
                            type="number"
                            min={1}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className={"text-xs"}>Height</Label>
                        <input
                            className="h-9 px-3 border rounded-md flex items-center w-full"
                            value={commonProperties.height}
                            onChange={(e) => {
                                setCommonProperties({
                                    ...commonProperties,
                                    height: e.target.value,
                                });
                                updateObjectProperty(
                                    "scaleY",
                                    e.target.value / selectedObject.height
                                );
                                markAsModified();
                            }}
                            type="number"
                            min={1}
                        />
                    </div>
                </div>
                {/* Opacity */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="opacity" className={"text-sm"}>
                            Opacity
                        </Label>
                        <span>{commonProperties.opacity}%</span>
                    </div>
                    <Slider
                        id="opacity"
                        min={0}
                        max={100}
                        step={1}
                        value={[commonProperties.opacity]}
                        onValueChange={(val) => {
                            const newVal = Number(val[0]);
                            setCommonProperties({
                                ...commonProperties,
                                opacity: newVal,
                            });
                            updateObjectProperty("opacity", newVal / 100);
                        }}
                    />
                </div>
                {/* Flip H, Flip V */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className={"h-8 text-xs"}
                        onClick={() => {
                            if (!canvas || !selectedObject) return;
                            const flipX = !selectedObject.flipX;
                            updateObjectProperty("flipX", flipX);
                        }}
                    >
                        <FlipHorizontal className="h-4 w-4 mr-1" />
                        Flip H
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className={"h-8 text-xs"}
                        onClick={() => {
                            if (!canvas || !selectedObject) return;
                            const flipY = !selectedObject.flipY;
                            updateObjectProperty("flipY", flipY);
                        }}
                    >
                        <FlipHorizontal className="h-4 w-4 mr-1" />
                        Flip V
                    </Button>
                </div>

                {/* Arrangement */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Layer Position</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className={"h-8 text-xs"}
                            onClick={() => {
                                if (!canvas || !selectedObject) return;
                                canvas.bringObjectToFront(selectedObject);
                                canvas.renderAll();
                                markAsModified();
                            }}
                        >
                            <MoveUp className="h-4 w-4" />
                            <span>Bring to front</span>
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className={"h-8 text-xs"}
                            onClick={() => {
                                if (!canvas || !selectedObject) return;
                                canvas.sendObjectToBack(selectedObject);
                                canvas.renderAll();
                                markAsModified();
                            }}
                        >
                            <MoveDown className="h-4 w-4" />
                            <span>Send to back</span>
                        </Button>
                    </div>
                </div>

                {/* Duplicate and delete */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">
                        Duplicate and Delete
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={"default"}
                            size={"sm"}
                            className={"h-8 text-xs"}
                            onClick={async () => {
                                if (!canvas || !selectedObject) return;
                                await cloneSelectedObject(canvas);
                                markAsModified();
                            }}
                        >
                            <Copy className="h-4 w-4" />
                            <span>Duplicate</span>
                        </Button>
                        <Button
                            variant={"destructive"}
                            size={"sm"}
                            className={"h-8 text-xs"}
                            onClick={() => {
                                if (!canvas || !selectedObject) return;
                                deletedSelectedObject(canvas);
                                markAsModified();
                            }}
                        >
                            <Trash className="h-4 w-4" />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>

                {/* Text related properties */}
                {objectType === "text" && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">Text Properties</h3>
                        <div className="space-y-2">
                            <Label className={"text-xs"} htmlFor="text-content">
                                Text Content
                            </Label>
                            <Textarea
                                id="text-content"
                                value={textProperties.text}
                                onChange={(e) => {
                                    setTextProperties({
                                        ...textProperties,
                                        text: e.target.value,
                                    });
                                    updateObjectProperty(
                                        "text",
                                        textProperties.text
                                    );
                                }}
                                className={"h-20 resize-none"}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={"text-xs"} htmlFor="font-size">
                                Font Size
                            </Label>
                            <Input
                                id="font-size"
                                value={textProperties.fontSize}
                                onChange={(e) => {
                                    setTextProperties({
                                        ...textProperties,
                                        fontSize: Number(e.target.value),
                                    });
                                    updateObjectProperty(
                                        "fontSize",
                                        Number(e.target.value)
                                    );
                                }}
                                className={"w-16 h-7 text-xs"}
                                type={"number"}
                                min={1}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={"text-sm"} htmlFor="font-family">
                                Font family
                            </Label>
                            <Select
                                value={textProperties.fontFamily}
                                onValueChange={(val) => {
                                    setTextProperties({
                                        ...textProperties,
                                        fontFamily: val,
                                    });
                                    updateObjectProperty("fontFamily", val);
                                }}
                            >
                                <SelectTrigger
                                    id="font-family"
                                    className={"h-10"}
                                >
                                    <SelectValue placeholder="Select Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontFamilies.map((fontItem) => (
                                        <SelectItem
                                            key={fontItem}
                                            value={fontItem}
                                            style={{ fontFamily: fontItem }}
                                        >
                                            {fontItem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className={"text-sm"}>Style</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={
                                        textProperties.fontWeight === "bold"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() => {
                                        const newWeight =
                                            textProperties.fontWeight === "bold"
                                                ? "normal"
                                                : "bold";
                                        setTextProperties({
                                            ...textProperties,
                                            fontWeight: newWeight,
                                        });
                                        updateObjectProperty(
                                            "fontWeight",
                                            newWeight
                                        );
                                    }}
                                    className={"w-8 h-8"}
                                >
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={
                                        textProperties.fontStyle === "italic"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() => {
                                        const newStyle =
                                            textProperties.fontStyle ===
                                            "italic"
                                                ? "normal"
                                                : "italic";
                                        setTextProperties({
                                            ...textProperties,
                                            fontStyle: newStyle,
                                        });
                                        updateObjectProperty(
                                            "fontStyle",
                                            newStyle
                                        );
                                    }}
                                    className={"w-8 h-8"}
                                >
                                    <Italic className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={
                                        textProperties.underline
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() => {
                                        setTextProperties({
                                            ...textProperties,
                                            underline:
                                                !textProperties.underline,
                                        });
                                        updateObjectProperty(
                                            "underline",
                                            !textProperties.underline
                                        );
                                    }}
                                    className={"w-8 h-8"}
                                >
                                    <Underline className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Label
                                    className={"text-sm"}
                                    htmlFor="text-color"
                                >
                                    Text Color
                                </Label>
                                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor:
                                                textProperties.textColor,
                                        }}
                                    ></div>
                                    <Input
                                        id="text-color"
                                        type="color"
                                        value={textProperties.textColor}
                                        onChange={(e) => {
                                            const newTextColor = e.target.value;
                                            setTextProperties({
                                                ...textProperties,
                                                textColor: newTextColor,
                                            });
                                            updateObjectProperty(
                                                "fill",
                                                newTextColor
                                            );
                                        }}
                                        className={
                                            "absolute inset-0 opacity-0 cursor-pointer"
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    className={"text-sm"}
                                    htmlFor="text-bg-color"
                                >
                                    Text BG Color
                                </Label>
                                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor:
                                                textProperties.textBackgroundColor,
                                        }}
                                    ></div>
                                    <Input
                                        id="text-bg-color"
                                        type="color"
                                        value={
                                            textProperties.textBackgroundColor
                                        }
                                        onChange={(e) => {
                                            const newTextBgColor =
                                                e.target.value;
                                            setTextProperties({
                                                ...textProperties,
                                                textBackgroundColor:
                                                    newTextBgColor,
                                            });
                                            updateObjectProperty(
                                                "backgroundColor",
                                                newTextBgColor
                                            );
                                        }}
                                        className={
                                            "absolute inset-0 opacity-0 cursor-pointer"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label
                                    className={"text-xs"}
                                    htmlFor="letter-spacing"
                                >
                                    Letter Spacing
                                </Label>
                                <span className={"text-xs"}>
                                    {textProperties.letterSpacing}
                                </span>
                            </div>
                            <Slider
                                id="letter-spacing"
                                min={-200}
                                max={800}
                                step={10}
                                value={[textProperties.letterSpacing]}
                                onValueChange={(val) => {
                                    const newSpacing = val[0];
                                    setTextProperties({
                                        ...textProperties,
                                        letterSpacing: newSpacing,
                                    });
                                    updateObjectProperty(
                                        "charSpacing",
                                        newSpacing
                                    );
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Shape related properties */}
                {objectType === "shape" && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">
                            Shape Properties
                        </h3>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fill-color"
                                    className={"text-xs"}
                                >
                                    Fill Color
                                </Label>
                                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor:
                                                shapeProperties.fillColor,
                                        }}
                                    ></div>
                                    <Input
                                        id="fill-color"
                                        type="color"
                                        value={shapeProperties.fillColor}
                                        onChange={(e) => {
                                            const newFillColor = e.target.value;
                                            setShapeProperties({
                                                ...shapeProperties,
                                                fillColor: newFillColor,
                                            });
                                            updateObjectProperty(
                                                "fill",
                                                newFillColor
                                            );
                                        }}
                                        className={
                                            "absolute inset-0 opacity-0 cursor-pointer"
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="border-color"
                                    className={"text-xs"}
                                >
                                    Border Color
                                </Label>
                                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundColor:
                                                commonProperties.borderColor,
                                        }}
                                    ></div>
                                    <Input
                                        id="border-color"
                                        type="color"
                                        value={commonProperties.borderColor}
                                        onChange={(e) => {
                                            const newBorderColor =
                                                e.target.value;
                                            setCommonProperties({
                                                ...commonProperties,
                                                borderColor: newBorderColor,
                                            });
                                            updateObjectProperty(
                                                "stroke",
                                                newBorderColor
                                            );
                                        }}
                                        className={
                                            "absolute inset-0 opacity-0 cursor-pointer"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-width" className={"text-xs"}>
                                Border Width
                            </Label>
                            <span className="text-xs">
                                {commonProperties.borderWidth}%
                            </span>
                            <Slider
                                id="border-width"
                                min={0}
                                max={20}
                                step={1}
                                value={[commonProperties.borderWidth]}
                                onValueChange={(val) => {
                                    const newBorderWidth = val[0];
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderWidth: newBorderWidth,
                                    });
                                    updateObjectProperty(
                                        "strokeWidth",
                                        newBorderWidth
                                    );
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-style" className={"text-xs"}>
                                Border Style
                            </Label>
                            <Select
                                value={commonProperties.borderStyle}
                                onValueChange={(val) => {
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderStyle: val,
                                    });
                                    let strokeDashArray = null;
                                    if (val === "dashed") {
                                        strokeDashArray = [5, 5];
                                    } else if (val === "dotted") {
                                        strokeDashArray = [2, 2];
                                    }

                                    updateObjectProperty(
                                        "strokeDashArray",
                                        strokeDashArray
                                    );
                                }}
                            >
                                <SelectTrigger
                                    id="border-style"
                                    className={"h-10"}
                                >
                                    <SelectValue placeholder="Select Border Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"solid"}>
                                        Solid
                                    </SelectItem>
                                    <SelectItem value={"dashed"}>
                                        Dashed
                                    </SelectItem>
                                    <SelectItem value={"dotted"}>
                                        Dotted
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                {objectType === "image" && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">
                            Image Properties
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="border-color" className={"text-xs"}>
                                Border Color
                            </Label>
                            <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor:
                                            commonProperties.borderColor,
                                    }}
                                ></div>
                                <Input
                                    id="border-color"
                                    type="color"
                                    value={commonProperties.borderColor}
                                    onChange={(e) => {
                                        const newBorderColor = e.target.value;
                                        setCommonProperties({
                                            ...commonProperties,
                                            borderColor: newBorderColor,
                                        });
                                        updateObjectProperty(
                                            "stroke",
                                            newBorderColor
                                        );
                                    }}
                                    className={
                                        "absolute inset-0 opacity-0 cursor-pointer"
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-width" className={"text-xs"}>
                                Border Width
                            </Label>
                            <span className="text-xs">
                                {commonProperties.borderWidth}%
                            </span>
                            <Slider
                                id="border-width"
                                min={0}
                                max={20}
                                step={1}
                                value={[commonProperties.borderWidth]}
                                onValueChange={(val) => {
                                    const newBorderWidth = val[0];
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderWidth: newBorderWidth,
                                    });
                                    updateObjectProperty(
                                        "strokeWidth",
                                        newBorderWidth
                                    );
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-style" className={"text-xs"}>
                                Border Style
                            </Label>
                            <Select
                                value={commonProperties.borderStyle}
                                onValueChange={(val) => {
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderStyle: val,
                                    });
                                    let strokeDashArray = null;
                                    if (val === "dashed") {
                                        strokeDashArray = [5, 5];
                                    } else if (val === "dotted") {
                                        strokeDashArray = [2, 2];
                                    }

                                    updateObjectProperty(
                                        "strokeDashArray",
                                        strokeDashArray
                                    );
                                }}
                            >
                                <SelectTrigger
                                    id="border-style"
                                    className={"h-10"}
                                >
                                    <SelectValue placeholder="Select Border Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"solid"}>
                                        Solid
                                    </SelectItem>
                                    <SelectItem value={"dashed"}>
                                        Dashed
                                    </SelectItem>
                                    <SelectItem value={"dotted"}>
                                        Dotted
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="filter" className={"text-xs"}>
                                Filter
                            </Label>
                            <Select
                                value={imageProperties.filter}
                                onValueChange={(val) =>
                                    handleImageFilterChange(val)
                                }
                            >
                                <SelectTrigger id="filter" className={"h-10"}>
                                    <SelectValue placeholder="Select Image Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"none"}>None</SelectItem>
                                    <SelectItem value={"grayscale"}>
                                        Grayscale
                                    </SelectItem>
                                    <SelectItem value={"sepia"}>
                                        Sepia
                                    </SelectItem>
                                    <SelectItem value={"invert"}>
                                        Invert
                                    </SelectItem>
                                    <SelectItem value={"blur"}>Blur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {imageProperties.filter === "blur" && (
                            <div className="space-y-2">
                                <div className="flex justify-between mb-4">
                                    <Label htmlFor="blur" className={"text-xs"}>
                                        Blur Amount
                                    </Label>
                                    <span className="font-medium text-xs">
                                        {imageProperties.blur}%
                                    </span>
                                </div>
                                <Slider
                                    id="blur"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[imageProperties.blur]}
                                    onValueChange={(val) => {
                                        handleBlurChange(val);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                {objectType === "path" && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">Path Properties</h3>
                        <div className="space-y-2">
                            <Label htmlFor="border-color" className={"text-xs"}>
                                Border Color
                            </Label>
                            <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor:
                                            commonProperties.borderColor,
                                    }}
                                ></div>
                                <Input
                                    id="border-color"
                                    type="color"
                                    value={commonProperties.borderColor}
                                    onChange={(e) => {
                                        const newBorderColor = e.target.value;
                                        setCommonProperties({
                                            ...commonProperties,
                                            borderColor: newBorderColor,
                                        });
                                        updateObjectProperty(
                                            "stroke",
                                            newBorderColor
                                        );
                                    }}
                                    className={
                                        "absolute inset-0 opacity-0 cursor-pointer"
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-width" className={"text-xs"}>
                                Border Width
                            </Label>
                            <span className="text-xs">
                                {commonProperties.borderWidth}%
                            </span>
                            <Slider
                                id="border-width"
                                min={0}
                                max={20}
                                step={1}
                                value={[commonProperties.borderWidth]}
                                onValueChange={(val) => {
                                    const newBorderWidth = val[0];
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderWidth: newBorderWidth,
                                    });
                                    updateObjectProperty(
                                        "strokeWidth",
                                        newBorderWidth
                                    );
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border-style" className={"text-xs"}>
                                Border Style
                            </Label>
                            <Select
                                value={commonProperties.borderStyle}
                                onValueChange={(val) => {
                                    setCommonProperties({
                                        ...commonProperties,
                                        borderStyle: val,
                                    });
                                    let strokeDashArray = null;
                                    if (val === "dashed") {
                                        strokeDashArray = [5, 5];
                                    } else if (val === "dotted") {
                                        strokeDashArray = [2, 2];
                                    }

                                    updateObjectProperty(
                                        "strokeDashArray",
                                        strokeDashArray
                                    );
                                }}
                            >
                                <SelectTrigger
                                    id="border-style"
                                    className={"h-10"}
                                >
                                    <SelectValue placeholder="Select Border Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"solid"}>
                                        Solid
                                    </SelectItem>
                                    <SelectItem value={"dashed"}>
                                        Dashed
                                    </SelectItem>
                                    <SelectItem value={"dotted"}>
                                        Dotted
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Properties;
