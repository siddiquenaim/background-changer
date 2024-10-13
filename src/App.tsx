import "@radix-ui/themes/styles.css";
import { framer } from "framer-plugin";
import "./App.css";

import { BackgroundChanger3 } from "./components/v3-background-changer";

import.meta.hot?.accept(() => {
  import.meta.hot?.invalidate();
});

void framer.showUI({ position: "top right", width: 280, height: 400 });

export function App() {
  return (
    <div>
      <BackgroundChanger3 />
    </div>
  );
}
