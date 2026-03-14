import type { ParentElement } from "../types/Element.ts";
import type { InputProperties } from "../types/Input.ts";
import { getDefaultProperties, type DefaultProperties } from "../types/Properties.ts";

export interface ButtonProperties extends DefaultProperties, InputProperties {
    onClick?: () => void;
}

export const Button: ParentElement<ButtonProperties> = (props) => {
    return <button
        {...getDefaultProperties(props, "ui-button")}
        disabled={props.disabled}
        onClick={props.onClick ? () => props.onClick?.() : undefined}
    >
        {props.children}
    </button>
}
