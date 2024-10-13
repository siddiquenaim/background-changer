// utils.ts

import { framer } from "framer-plugin";

// Utility function to convert RGB(A) to Hex without the alpha (opacity) channel
export function rgbaToHex(rgb: string): string {
  const rgba = rgb
    .replace(/[rgba\(\)\s]/g, "") // Remove unwanted characters
    .split(","); // Split into components

  // Convert each RGB component to a two-digit hex value
  const hex = rgba.slice(0, 3).map((component) => {
    const intValue = parseInt(component, 10);
    return intValue.toString(16).padStart(2, "0"); // Ensure two digits
  });

  return `#${hex.join("").toUpperCase()}`; // Join as hex and return
}

// Utility to convert colors to full hex format (six characters) or handle named colors like "WHITE"
export function toFullHexColor(color: string): string {
  if (color.startsWith("rgb")) {
    return rgbaToHex(color); // Convert RGB(A) to hex
  }

  if (color.toUpperCase() === "WHITE") {
    return "#FFFFFF";
  }

  // Convert shorthand hex (#26f) to full hex (#2266FF)
  if (color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  return color.toUpperCase(); // Return full hex in uppercase
}

// Function to get all nodes with a background color
export async function getNodesWithBackgroundColor() {
  const nodesWithBg = await framer.getNodesWithAttribute("backgroundColor");
  return nodesWithBg || []; // Return empty array if no nodes found
}
