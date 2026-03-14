import { useRef } from "react";

export interface BaseControls {
    open: () => void;
    close: () => void;
}

export interface Controls extends BaseControls {
    switch: () => void;
    isOpen: () => boolean;
}

export interface Controller extends Controls {
    register: (controls: BaseControls) => () => void;
}

export function useController(open = false) {
    const controlData = useRef<{ isOpen: boolean, controls: BaseControls[]}>({
        isOpen: open,
        controls: [],
    });

    const call = (event: keyof BaseControls): void => {
        for (const control of controlData.current.controls) {
            try {
                control[event]();
            } catch (e) {
                console.error();
            }
        }
    }
    
    return {
        open: () => {
            controlData.current.isOpen = true;
            call("open");
        },
        close: () => {
            controlData.current.isOpen = false;
            call("close");
        },
        switch: () => {
            controlData.current.isOpen = !controlData.current.isOpen;
            call(controlData.current.isOpen ? "open" : "close");
        },
        isOpen: () => controlData.current.isOpen,
        register: (controls) => {
            controlData.current.controls.push(controls);
            return () => {
                controlData.current.controls.splice(
                    controlData.current.controls.indexOf(controls),
                    1,
                );
            }
        },
    } satisfies Controller;
}
