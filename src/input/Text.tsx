import type { Element } from "../types/Element.ts";
import type { InputProperties } from "../types/Input.ts";
import { getDefaultProperties, type DefaultProperties } from "../types/Properties.js";

export interface TextInputProperties extends DefaultProperties, InputProperties<string> {
}

export const Text: Element<TextInputProperties> = (props) => {
    const value = props.input.use();

    return <input
        {...getDefaultProperties(props, "ui-input-text")}
        type="text"
        value={value}
        disabled={props.disabled}
        onChange={(event) => props.input.set(event.target.value)}
    />
}
