import "@radix-ui/themes/styles.css";
import { framer } from "framer-plugin";
import "./App.css";
import { BackgroundChanger } from "./components/background-changer";

import.meta.hot?.accept(() => {
  import.meta.hot?.invalidate();
});

void framer.showUI({ position: "top right", width: 280, height: 160 });

export function App() {
  return (
    <div>
      <BackgroundChanger />
    </div>
  );
}
