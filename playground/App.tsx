import { DialogTest } from "./sections/DialogTest.tsx";
import { DrawerTest } from "./sections/DrawerTest.tsx";

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
        </div>
    </>);
}