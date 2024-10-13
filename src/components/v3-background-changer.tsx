import { CanvasNode, framer } from "framer-plugin";
import { useEffect, useState } from "react";
import { ColorInput3 } from "./color-input-v3"; // The updated RGBA color picker

// Show the UI at the top right of the canvas
framer.showUI({
  position: "top right",
  width: 240,
  height: 300,
});

// Hook to track the selection on the canvas
function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
}

// Function to get all nodes with a background color
async function getNodesWithBackgroundColor() {
  const nodesWithBg = await framer.getNodesWithAttribute("backgroundColor");
  return nodesWithBg || []; // Return empty array if no nodes found
}

export function BackgroundChanger3() {
  const selection = useSelection();
  const layer = selection.length === 1 ? "layer" : "layers";
  const [groupedColors, setGroupedColors] = useState<
    { color: string; nodes: CanvasNode[] }[]
  >([]);

  // Fetch background colors of selected nodes and group them by color
  useEffect(() => {
    async function fetchColors() {
      const nodesWithBg = await getNodesWithBackgroundColor();

      // Filter selected nodes and group by background color
      const selectedNodes = nodesWithBg.filter((node) =>
        selection.some((selNode) => selNode.id === node.id)
      );

      // Group nodes by their background color (now in RGBA or HEX)
      const colorGroups = selectedNodes.reduce<
        { color: string; nodes: CanvasNode[] }[]
      >((acc, node) => {
        const color =
          node.backgroundColor?.toString() || "rgba(255, 255, 255, 1)"; // Default white color in RGBA

        const existingGroup = acc.find((group) => group.color === color);
        if (existingGroup) {
          existingGroup.nodes.push(node);
        } else {
          acc.push({
            color,
            nodes: [node],
          });
        }
        return acc;
      }, []);

      setGroupedColors(colorGroups);
    }

    if (selection.length > 0) {
      fetchColors();
    } else {
      setGroupedColors([]); // Clear colors if nothing is selected
    }
  }, [selection]);

  // Function to update all nodes of a particular color
  const handleColorChange = async (oldColor: string, newColor: string) => {
    const group = groupedColors.find((g) => g.color === oldColor);

    if (group) {
      // Update all nodes with the old color to the new color
      await Promise.all(
        group.nodes.map((node) =>
          framer.setAttributes(node.id, { backgroundColor: newColor })
        )
      );

      // Update the grouped colors state with the new color
      setGroupedColors((prevColors) =>
        prevColors.map((group) =>
          group.color === oldColor ? { ...group, color: newColor } : group
        )
      );
    }
  };

  return (
    <main className="container">
      <div className="content-container">
        <p>
          Select layers to update the colors. <br /> You have {selection.length}{" "}
          {layer} selected.
        </p>

        {groupedColors.length > 0 && (
          <div className="color-list">
            <h4>Grouped Colors:</h4>
            <ul>
              {groupedColors.map((group, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <ColorInput3
                    value={group.color}
                    onChange={(value) => {
                      if (value) {
                        handleColorChange(group.color, value);
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
