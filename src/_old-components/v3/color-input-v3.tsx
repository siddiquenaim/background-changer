import { useState, useEffect, useRef } from "react";
import { RgbaColorPicker, RgbaColor } from "react-colorful";
import "../App.css"; // Assuming the CSS you provided is in this file

// Helper function to convert RGBA to HEX
const rgbaToHex = ({ r, g, b }: RgbaColor): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

// Helper function to convert HEX to RGBA
const hexToRgba = (hex: string): RgbaColor => {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (hex.startsWith("#")) {
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    } else if (hex.length === 9) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
      a = parseInt(hex.slice(7, 9), 16) / 255;
    }
  }

  return { r, g, b, a };
};

// Updated ColorInput3 component with color preview and picker on click
export function ColorInput3({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
  // Default color state for the picker (RGBA)
  const [rgbaColor, setRgbaColor] = useState<RgbaColor>({
    r: 34,
    g: 102,
    b: 255,
    a: 1,
  });

  // State for the HEX input
  const [hexColor, setHexColor] = useState<string>(rgbaToHex(rgbaColor));

  // Toggle picker visibility
  const [showPicker, setShowPicker] = useState<boolean>(false);

  // Refs for color preview and picker elements
  const previewRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync color picker with the value prop
  useEffect(() => {
    const parseRgba = (value: string): RgbaColor => {
      const rgbaMatch = value.match(
        /rgba?\((\d+), (\d+), (\d+),? (\d?.?\d*)?\)/
      );
      if (rgbaMatch) {
        return {
          r: parseInt(rgbaMatch[1]),
          g: parseInt(rgbaMatch[2]),
          b: parseInt(rgbaMatch[3]),
          a: parseFloat(rgbaMatch[4]) || 1,
        };
      }
      return { r: 255, g: 255, b: 255, a: 1 }; // Default white color
    };

    if (value) {
      const parsedColor = parseRgba(value);
      setRgbaColor(parsedColor); // Sync state with the value prop
      setHexColor(rgbaToHex(parsedColor)); // Sync HEX input with the parsed RGBA value
    }
  }, [value]);

  // Handle HEX input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexColor(hex);

    if (/^#([0-9A-F]{6})$/i.test(hex)) {
      const newRgbaColor = hexToRgba(hex);
      setRgbaColor(newRgbaColor); // Update the color picker
      const rgbaString = `rgba(${newRgbaColor.r}, ${newRgbaColor.g}, ${newRgbaColor.b}, ${newRgbaColor.a})`;
      onChange?.(rgbaString); // Callback with the updated RGBA string
    }
  };

  // Close picker if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        previewRef.current &&
        pickerRef.current &&
        !previewRef.current.contains(event.target as Node) &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false); // Close the picker if clicked outside
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component is unmounted or on update
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="color-input">
      {/* Color Preview */}
      <div className="preview-container" ref={previewRef}>
        <div
          className="color-preview"
          onClick={() => setShowPicker(!showPicker)}
          style={{
            backgroundColor: hexColor,
            height: "30px",
            width: "30px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #ddd",
          }}
        ></div>

        {/* HEX input */}
        <input
          type="text"
          value={hexColor}
          onChange={handleHexChange}
          maxLength={7} // Ensure only valid 7 character HEX colors
          style={{
            marginLeft: "10px",
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "100px",
          }}
        />
      </div>

      {/* Show color picker on click */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="picker-container"
          style={{ position: "absolute", zIndex: 1000 }}
        >
          <RgbaColorPicker
            color={rgbaColor}
            onChange={(newColor) => {
              setRgbaColor(newColor); // Update picker color state
              setHexColor(rgbaToHex(newColor)); // Sync HEX input with the picker change
              const rgbaString = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})`;
              onChange?.(rgbaString); // Callback with the new color
            }}
          />
        </div>
      )}
    </div>
  );
}
