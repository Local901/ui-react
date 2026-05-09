import { DialogTest } from "./sections/DialogTest.tsx";
import { DrawerTest } from "./sections/DrawerTest.tsx";
import { InputTest } from "./sections/InputTest.tsx";

export default function App() {
    return (<>
        <div style={ { padding: 40 } }>
            <h1>UI Playground</h1>
            <div className="box" style={{ overflow: "hidden" }}>
                <DialogTest/>
            </div>
            <div className="box">
                <DrawerTest/>
            </div>
            <div className="box">
                <InputTest/>
            </div>
        </div>
    </>);
}