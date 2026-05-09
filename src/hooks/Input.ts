import { useReducer, useRef, type ActionDispatch } from "react";

type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date | URL | Buffer | Uint8Array;

type IsTuple<T> =
    T extends readonly unknown[]
        ? number extends T['length']
            ? false
            : true
        : false;

type IsPlainObject<T> =
    T extends object
        ? T extends unknown[]
            ? IsTuple<T> extends true
                ? true
                : false
            : T extends Function
                ? false
                : T extends Primitive 
                    ? false
                    : true
        : false;

type PathType<T, Prefix extends string = ""> =
    // include current level
    (Prefix extends "" ? { "": T } : { [K in Prefix]: T }) &

    // recurse into object properties
    (IsPlainObject<T> extends true
        ? {
            [K in keyof T & (IsTuple<T> extends true ? `${number}` : string)]:
                IsTuple<T> extends true
                    ? T[K]
                : PathType<
                    T[K],
                    Prefix extends ""
                        ? `${K}`
                        : `${Prefix}.${K}`
                >
        }[keyof T & (IsTuple<T> extends true ? `${number}` : string)]
        : {});

type Paths<T> = keyof PathType<T> & string;

export interface Input<T> {
    use(): T;
    getInput<P extends Paths<T> = "">(path?: P): Input<PathType<T>[P]>;
    /**
     * Get the value of the input or a sub-value.
     * 
     * WARNING: This value is not reactive. Only use for on demand lookup in callbacks or effects.
     *
     * @param path Path to the value.
     * @returns The value that is currently stored.
     */
    get<P extends Paths<T> = "">(path?: P): PathType<T>[P];
    /**
     * Set a value in the input. This will trigger rerenders.
     *
     * @param value The value to set.
     * @param path Path to the value.
     */
    set<P extends Paths<T> = "">(value: PathType<T>[P], path?: P): void;
    /**
     * Reset the value back to the default value. This will trigger rerenders.
     * 
     * @param path Path to the value.
     */
    reset<P extends Paths<T> = "">(path?: P): void;
    /**
     * Get the default value.
     * 
     * @param path Path to the value.
     */
    getDefault<P extends Paths<T> = "">(path?: P): PathType<T>[P];
    /**
     * Will update the default value. But this will not trigger rerenders.
     * 
     * @param value The value to set.
     * @param path Path to the value.
     */
    setDefault<P extends Paths<T> = "">(value: PathType<T>[P], path?: P): void;
    /**
     * Trigger rerender fot this input.
     * 
     * This is for internal use. It will rerender all components that use this input.
     */
    rerender(): void;
}

function mergePaths(root: string, subPath: string = ""): string {
    if (root === "") {
        return subPath;
    }
    if (subPath === "") {
        return root;
    }
    return `${root}.${subPath}`;
}

class InputClass<ROOT, PATH extends Paths<ROOT>> implements Input<PathType<ROOT>[PATH]> {
    private reducers: ActionDispatch<[]>[] = [];
    public constructor(
        private rootInput: RootInput<ROOT>,
        private readonly path: PATH,
    ) {}

    /** @inheritDoc */
    public use(): PathType<ROOT>[PATH] {
        const index = useRef<number | undefined>(undefined);
        const [_value, reducer] = useReducer((prev) => ++prev, 0);

        if (!index.current) {
            index.current = this.reducers.length;
        }
        this.reducers[index.current] = reducer;

        return this.rootInput.get(this.path);
    }
    /** @inheritDoc */
    public rerender(): void {
        for(const reducer of this.reducers) {
            reducer();
        }
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public getInput<P extends Paths<PathType<ROOT, PATH>> = "">(path?: P): Input<PathType<PathType<ROOT>[PATH]>[P]> {
        // @ts-expect-error Complex type.
        return this.rootInput.getInput(mergePaths(this.path, path));
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public get<P extends Paths<PathType<ROOT, PATH>> = "">(path?: P): PathType<PathType<ROOT>[PATH]>[P] {
        // @ts-expect-error Complex type.
        return this.rootInput.get(mergePaths(this.path, path));
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public set<P extends Paths<PathType<ROOT, PATH>> = "">(value: PathType<PathType<ROOT>[PATH]>[P], path?: P): void {
        // @ts-expect-error Complex type.
        return this.rootInput.set(mergePaths(this.path, path), value);
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public reset<P extends Paths<PathType<ROOT, PATH>> = "">(path?: P): void {
        // @ts-expect-error Complex type.
        return this.rootInput.reset(mergePaths(this.path, path));
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public getDefault<P extends Paths<PathType<ROOT, PATH>> = "">(path?: P): PathType<PathType<ROOT>[PATH]>[P] {
        // @ts-expect-error Complex type.
        return this.rootInput.getDefault(mergePaths(this.path, path));
    }
    /** @inheritDoc */
    // @ts-expect-error Complex type.
    public setDefault<P extends Paths<PathType<ROOT, PATH>> = "">(value: PathType<PathType<ROOT>[PATH]>[P], path?: P): void {
        // @ts-expect-error Complex type.
        return this.setDefault(value, mergePaths(this.path, path));
    }
}

type InternalData = {
    input?: Input<unknown>;
    current: unknown;
}

class RootInput<T> {
    private inputs: Record<string, InternalData> = {};

    public constructor(private defaults: T) {
        this.processValue("", defaults);
    }

    private processValue(path: string, value: unknown): unknown {
        const type = typeof value;
        if (type !== "object" || [Date, URL, Buffer, Uint8Array].some((t) => value instanceof t)) {
            this.inputs[path] ??= { current: value };
            this.inputs[path].current = value;
            return value;
        }
        if (Array.isArray(value)) {
            const arrayCopy = [...value];
            this.inputs[path] ??= { current: arrayCopy };
            this.inputs[path].current = arrayCopy;
            return arrayCopy;
        }
        const objCopy = Object.fromEntries(Object.entries(value as {}).map(([key, value]) => [
            key,
            this.processValue(mergePaths(path, key), value),
        ]));
        this.inputs[path] ??= { current: objCopy };
        this.inputs[path].current = objCopy;
        return objCopy;
    }

    private getPathsOf(path: string): [string, InternalData][] {
        return Object.entries(this.inputs)
            .filter(([key]) => key.startsWith(path) && (
                key.length === path.length ||
                key[path.length] === "."
            ));
    }

    private deepClear(path: string) {
        for (const [,data] of this.getPathsOf(path)) {
            data.current = undefined;
        }
    }

    private insertValue(path: string, value: unknown) {
        let currentValue = this.processValue(path, value);

        // Walk down to create objects.
        const parts = path.split(".");
        const numberMatch = parts[parts.length - 1]?.match(/\d+/)
        const tupleIndex = numberMatch ? parts.length - 1 : -1;
        for (let end = parts.length - 1; end > 0; end--) {
            const subPath = parts.slice(0, end).join(".");
            const data = this.inputs[subPath];
            if (!data?.current) {
                currentValue = end === tupleIndex
                    ? (() => {
                        const a = [];
                        a[Number.parseInt(numberMatch![0])] = currentValue;
                        return a;
                    })
                    : { [parts[end - 1] as string]: currentValue };
                this.inputs[subPath] ??= {
                    current: currentValue,
                };
                this.inputs[subPath].current = currentValue;
                continue;
            }
            if (end === tupleIndex) {
                if (!Array.isArray(data.current)) {
                    throw new Error(`Expected tuple type at ${subPath}`);
                }
                data.current[Number.parseInt(numberMatch![0])] = currentValue;

                // No need to go deeper.
                break;
            }
            if (
                typeof data.current !== "object" ||
                Array.isArray(data.current) ||
                [Date, URL, Buffer, Uint8Array].some((t) => data.current instanceof t)
            ) {
                throw new Error(`Expected a record type at ${subPath}`);
            }
            (data.current as Record<string, unknown>)[parts[end - 1] as string] = currentValue;

            // No need to go deeper.
            break;
        }
    }

    private getData(path: string): InternalData | undefined {
        if (path in this.inputs) {
            return this.inputs[path];
        }

        // tuple fallback. (expect no record object in tuple)
        const match = path.match(/[\.^]-?\d+$/);
        if (match) {
            const tuplePath = path.substring(0, match.index);
            if (!(tuplePath in this.inputs)) {
                // Undefined for now as we can create the relations on set.
                return undefined;
            }
            const tuple = this.inputs[tuplePath];
            if (!tuple) {
                // Undefined for now as we can create the relations on set.
                return undefined;
            }
            if (!Array.isArray(tuple.current)) {
                throw new Error(`Parent of ${path} has to be a tuple.`);
            }
            // Add relation since it already exists in the tuple.
            this.inputs[path] = {
                current: tuple.current.at(Number.parseInt(match[0].replace(".", ""))),
            }
        }

        return undefined;
    }

    private triggerRerender(path: string): void {
        for (const key of Object.keys(this.inputs)
            .filter((k) => (k.startsWith(path) && (k.length === path.length || k[path.length] === ".")) || path.startsWith(`${k}.`))
            .sort((k1, k2) => k1.length - k2.length)
        ){
            this.getData(key)?.input?.rerender();
        }
    }

    public getInput<P extends Paths<T>>(path: P): Input<PathType<T>[P]> {
        if (!this.inputs[path]) {
            this.inputs[path] = {
                input: new InputClass<T, P>(this, path) as unknown as Input<unknown>,
                current: this.get(path),
            };
        }
        return this.inputs[path].input as Input<PathType<T>[P]>;
    }
    public get<P extends Paths<T>>(path: P): PathType<T>[P] {
        return this.getData(path)?.current as PathType<T>[P];
    }

    public set<P extends Paths<T>>(path: P, value: PathType<T>[P]): void {
        // Will process Value and update parent object. (We always want to do this on set.)
        this.deepClear(path);
        this.insertValue(path, value);

        const data = this.get(path);

        this.triggerRerender(path);
    }

    public getDefault<P extends Paths<T>>(path: P): PathType<T>[P] {
        if (!path) {
            return this.defaults as PathType<T>[P];
        }
        const sections = path.split(".");
        let current: unknown = this.defaults;
        while(sections.length) {
            if (!current || typeof current !== "object") {
                return undefined as unknown as PathType<T>[P];
            }
            current = (current as Record<string, unknown>)[sections.shift()!]
        }
        return current as PathType<T>[P];
    }

    public setDefault<P extends Paths<T>>(path: P, value: PathType<T>[P]): void {
        if (!path) {
            this.defaults = value as T;
        }
        const sections = path.split(".");
        if (typeof this.defaults !== "object") {
            this.defaults = {} as T;
        }
        let current: unknown = this.defaults;
        while(sections.length > 1) {
            if (!current || typeof current !== "object") {
                throw new Error("Unable to set Default value.");
            }
            const key = sections.shift()!;
            if (!(key in current)) {
                current = ((current as Record<string, unknown>)[key] = {});
            }
            if (typeof (current as Record<string, unknown>)[key] !== "object") {
                (current as Record<string, unknown>)[key] = {} as T;
            }
            current = (current as Record<string, unknown>)[key];
        }
        (current as Record<string, unknown>)[sections[0]!] = value;
    }

    public reset<P extends Paths<T>>(path: P): void {
        this.set(path, this.getDefault(path));
    }
}

export function useInput<T>(init: T): Input<T> {
    const controller = useRef<RootInput<T>>(null);
    if (!controller.current) {
        controller.current = new RootInput(init);
    }
    return controller.current.getInput("");
}
