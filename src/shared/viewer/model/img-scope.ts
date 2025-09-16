import { createEvent, createStore } from "effector";

interface scopeImg {
    preview?: string;
    alt: string;
    previewSize: number;
    positionAbove: boolean | number;
    mousePos: {
        x: number
        y: number
    }
}

export const hoveredImg = createEvent<scopeImg | null>();

export const $scopeImg = createStore<scopeImg | null>(null)
    .on(hoveredImg, (_, payload) => payload);