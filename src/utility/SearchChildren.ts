import type { ElementType, JSX } from "react";
import type { ChildType } from "../types/Element.ts";

export type SplitResponse = [JSX.Element[], ChildType];

/**
 * Split the list of children into matching and mismatching respectively.
 *
 * @param children The children to split.
 * @param callback Callback to check if a child should be split.
 * @returns [match[], mismatch[]]
 */
export function splitChildren(children: ChildType, callback: (element: JSX.Element) => boolean): SplitResponse {
    if (!Array.isArray(children)) {
        return [[], children]
    }
    const response: [JSX.Element[], JSX.Element[]] = [[], []];

    if (!children) {
        return response;
    }

    for (const child of children) {
        response[callback(child) ? 0 : 1].push(child);
    }

    return response;
}

/**
 * Split the list of children into matching and mismatching respectively that match the type.
 *
 * ```typescript
 * splitChildrenOfType(children, Fallback)
 * ```
 *
 * @param children The children to split.
 * @param type Element type.
 * @returns [match[], mismatch[]]
 */
export function splitChildrenOfType<TYPE extends ElementType = ElementType>(children: ChildType, type: TYPE): SplitResponse {
    return splitChildren(children, (child) => child.type === type);
}
