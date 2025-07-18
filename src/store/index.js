'use client'

import { centerCanvas } from "@/fabric/fabric-utils"
import { create } from "zustand"

export const useEditorStore = create((set, get) => ({
    canvas: null,
    setCanvas: (canvas) => {
        set({ canvas })
        if (canvas) {
            centerCanvas(canvas)
        }
    },
    designId: null,
    setDesignId: id => set({ designId: id }),

    isEditing: true,
    setIsEditing: flag => set({ isEditing: flag }),

    name: '',
    setName: value => set({ name: value }),


    resetStore: () => {
        set({
            canvas: null,
            designId: null,
            isEditing: true,
            name: ""
        })
    }
}))