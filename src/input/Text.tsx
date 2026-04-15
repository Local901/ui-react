import { type ChangeEvent } from "react";
import type { Element } from "../types/Element.ts";
import type { InputProperties } from "../types/Input.ts";
import { getDefaultProperties, type DefaultProperties } from "../types/Properties.ts";
import { useCallback } from "../hooks/Callback.ts";

export interface TextInputProperties extends DefaultProperties, InputProperties {
    value?: string;

    onChange?: (value: string) => void;
}

export const Text: Element<TextInputProperties> = (props) => {
    const changeHandler = useCallback((event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        props.onChange?.(event.target.value);
    });

    return <input
        {...getDefaultProperties(props, "ui-input-text")}
        type="text"
        disabled={props.disabled}
        onChange={changeHandler}
    />
}
