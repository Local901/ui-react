import type { LayoutElement } from "./Types.js";

export enum Direction {
    Horizontal = "horizontal",
    Vertical = "vertical",
}

export interface StackProps {
    /** Extra class value. */
    class?: string;
    /**
     * The direction the elements should be laid out.
     *
     * @default Direction.Vertical
     */
    direction?: Direction;
}

/**
 * A layout component for stacking elements.
 *
 * ### classes
 * * `ui-stack`
 * * `direction-horizontal` | `direction-vertical`
 *
 * ### element style:
 * ```css
 * Stack {
 *   display: flex;
 *   flex-direction: row | column;
 * }
 * ```
 *
 * @param props.direction The direction the stack should order the elements.
 */
export const Stack: LayoutElement<StackProps> = (props) => {
    return (
        <div
            className={`ui-stack direction-${props.direction ?? Direction.Vertical} ${props.class}`.trim()}
            style={{
                display: "flex",
                flexDirection: props.direction === Direction.Horizontal ? "row" : "column",
            }}
        >
            { props.children }
        </div>
    )
}
