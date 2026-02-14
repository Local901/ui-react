import { useEffect as uEffect } from "react";

export type EffectCallback = () => void | (() => void);

export function useEffect(callback: EffectCallback, deps?: unknown[]): void {
    return uEffect(callback, deps);
}
