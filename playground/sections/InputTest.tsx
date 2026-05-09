import { useInput } from "../../src/hooks/Input.ts";
import { Button } from "../../src/input/Button.tsx";
import { Text } from "../../src/input/Text.tsx";
import { Uint } from "../../src/input/Uint.tsx";
import { Stack } from "../../src/layout/Stack.tsx";
import type { Element } from "../../src/types/Element.ts";

export const InputTest: Element = () => {
    const input = useInput({
        number: 0,
        text: "Hello there.",
    });

    return (<>
        <Button onClick={input.reset}>Reset</Button>
        <Stack direction="column">
            <Stack direction="row">
                <Text input={input.getInput("text")} />
                <Button onClick={() => input.reset("text")}>Reset text</Button>
                <Button onClick={() => input.setDefault(input.get("text"), "text")}>Set as default</Button>
            </Stack>
            <Stack direction="row">
                <Uint input={input.getInput("number")} />
                <Button onClick={() => input.reset("number")}>Reset number</Button>
                <Button onClick={() => input.setDefault(input.get("number"), "number")}>Set as default</Button>
            </Stack>
        </Stack>
    </>)
}
