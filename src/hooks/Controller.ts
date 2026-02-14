import { useRef } from "react";

export interface Controller {
    open: () => void;
    close: () => void;
    register: (controls: Omit<Controller, "register">) => void;
}

export function useController() {
    const controlList = useRef<Omit<Controller, "register">[]>([]);

    const call = (event: keyof Omit<Controller, "register">): void => {
        for (const control of controlList.current) {
            try {
                control[event]();
            } catch (e) {
                console.error();
            }
        }
    }
    
    return {
        open: () => call("open"),
        close: () => call("close"),
        register: (controls) => controlList.current.push(controls),
    } satisfies Controller;
}
