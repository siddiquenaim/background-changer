import { CanvasNode, framer } from "framer-plugin";
import { useEffect, useState } from "react";
import { ColorInput3 } from "./color-input-v3"; // The updated RGBA color picker
import { getNodesWithBackgroundColor } from "../../utils/utils";

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

// Utility function to normalize colors to full hex or rgba format
function normalizeColor(color: string | undefined): string {
  if (!color) {
    return "rgba(255, 255, 255, 1)"; // Fallback to white if color is undefined
  }

  // Handle named colors (e.g., "white")
  if (color.toLowerCase() === "white") return "rgba(255, 255, 255, 1)";

  // Convert shorthand hex (#RGB) to full hex (#RRGGBB)
  if (color.startsWith("#") && color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  // Convert to rgba if it's already a valid rgba() or rgb() string
  if (color.startsWith("rgb")) {
    return color; // Already in rgb/rgba format
  }

  return color; // Return the color as is (full hex or valid color)
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

      // Group nodes by their background color
      const colorGroups = selectedNodes.reduce<
        { color: string; nodes: CanvasNode[] }[]
      >((acc, node) => {
        const rawColor = node.backgroundColor?.toString();
        const color = normalizeColor(rawColor); // Normalize color with fallback

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
