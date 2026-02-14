import { useSignal } from "./Signal.js";

export enum ResourceState {
    LOADING = 1,
    READY = 2,
    REFETCHING = 3,
    ERROR = 4,
    RETRY = 5,
}
export type ResourceCallback<T> = (refetching: boolean) => T | Promise<T>;
export type ResourceValue<T> = {
    state: ResourceState;
    latest?: T;
    error?: unknown;
}
export type ResourceControls = {
    refetch: () => void;
}

export function useResource<T>(callback: ResourceCallback<T>): [ResourceValue<T>, ResourceControls] {
    const [value, setValue] = useSignal<ResourceValue<T>>({
        state: ResourceState.LOADING,
    });

    const loadResource = async (refetching: boolean) => {
        try {
            const result = await callback(refetching);
            setValue({
                state: ResourceState.READY,
                latest: result,
            })
        } catch (error) {
            setValue({
                state: ResourceState.ERROR,
                error,
            });
        }
    }

    if (value.state === ResourceState.LOADING) {
        void loadResource(false);
    }

    return [value, {
        refetch: () => {
            setValue((prev) => ({ ...prev, state: prev.state | ResourceState.LOADING }));
            void loadResource(true);
        },
    }];
}
