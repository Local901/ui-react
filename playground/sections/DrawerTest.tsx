import { useController } from "../../src/hooks/Controller.ts";
import { Button } from "../../src/input/Button.tsx";
import { Stack } from "../../src/layout/Stack.tsx";
import { Drawer } from "../../src/overlay/Drawer.tsx";
import { Direction } from "../../src/types/Direction.ts";
import type { Element } from "../../src/types/Element.ts";
import { Position } from "../../src/types/Position.ts";

export const DrawerTest: Element = () => {
    const controller = useController();
    return (<>
        <Button onClick={controller.switch}>Flip</Button>
        <Stack>
            <Stack direction={Direction.Row}>
                Here is <Drawer controller={controller}><pre> Jonny!</pre></Drawer>
            </Stack>
            is
            <Drawer controller={controller} position={Position.top}>Jonny!!!!</Drawer>
        </Stack>
    </>)
}
