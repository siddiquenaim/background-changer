import "@radix-ui/themes/styles.css";
import { framer } from "framer-plugin";
import "./App.css";

import { BackgroundChanger2 } from "./components/v2/v2-background-changer";

import.meta.hot?.accept(() => {
  import.meta.hot?.invalidate();
});

void framer.showUI({ position: "top right", width: 280, height: 400 });

export function App() {
  return (
    <div>
      <BackgroundChanger2 />
    </div>
  );
}
