import { CanvasNode, framer } from "framer-plugin";
import { useEffect, useState } from "react";
import { ColorInput } from "../v2/color-input";

framer.showUI({
  position: "top right",
  width: 240,
  height: 95,
});

function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
}

export function BackgroundChanger() {
  const selection = useSelection();
  const layer = selection.length === 1 ? "layer" : "layers";
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  const updateColor = async (node: CanvasNode) => {
    await framer.setAttributes(node.id, {
      backgroundColor: backgroundColor,
    });
  };

  const handleOnClick = () => {
    selection.forEach((node) => updateColor(node));
  };

  return (
    <main className="container">
      <div className="content-container">
        <p>
          Select layers to update the colors. <br /> You have {selection.length}{" "}
          {layer} selected.
        </p>

        <ColorInput
          value={backgroundColor}
          onChange={(value) => {
            if (value) {
              setBackgroundColor(value as string);
            }
          }}
        />
        <button className="framer-button-primary" onClick={handleOnClick}>
          Update Color
        </button>
      </div>
    </main>
  );
}
