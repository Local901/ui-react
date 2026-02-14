import type { JSX } from "react";

export type LayoutElement<PROPS extends {} = {}> = (props: PROPS & { children: JSX.Element[] }) => JSX.Element;
