import type { JSX, ReactNode } from "react";

export type Properties = Omit<{}, "children">;

export type ChildType = ReactNode;

export type Element<PROPS extends Properties = {}> = (
    props: PROPS
) => JSX.Element;
export type ParentElement<PROPS extends Properties = {}> = (
    props: PROPS & { children?: ChildType }
) => JSX.Element;
export type FactoryElement<PROPS extends Properties = {}, ARGS extends unknown[] = []> = (
    props: PROPS & { children: (...args: ARGS) => ChildType }
) => JSX.Element;
