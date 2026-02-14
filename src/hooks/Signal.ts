import { useRef, useState } from "react";

export type SignalInitValue<T> = T | (() => T);
export type SignalSet<T> = (value: T | ((prev: T) => T)) => void;

export function useSignal<T>(init: SignalInitValue<T>): [T, SignalSet<T>] {
    return useState<T>(init);
}

export function useDebounceSignal<T>(timeout: number, init: SignalInitValue<T>): [T, SignalSet<T>] {
    const [value, setValue] = useSignal(init);
    const lastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    return [value, (v) => {
        if (lastTimeout.current) {
            clearTimeout(lastTimeout.current);
        }
        lastTimeout.current = setTimeout(() => {
            lastTimeout.current = undefined;
            setValue(v);
        }, timeout);
    }]
}
