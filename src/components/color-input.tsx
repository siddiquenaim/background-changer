// ColorInput Component
import { useRef, useEffect, useState } from "react";
import { toFullHexColor } from "../utils/utils";

export function ColorInput({
  value,
  onChange,
}: {
  value: string | boolean;
  onChange?: (value: string | boolean) => void;
  erasable?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(value as string);

  useEffect(() => {
    if (typeof value === "string") {
      const hexValue = toFullHexColor(value); // Ensure the value is in hex
      setInputValue(hexValue); // Update input value
    }
  }, [value]);

  return (
    <div className="color-input">
      <input
        ref={inputRef}
        type="color"
        value={inputValue}
        onChange={(e) => {
          const newColor = toFullHexColor(e.target.value); // Ensure valid hex
          setInputValue(newColor); // Update internal state
          onChange?.(newColor); // Notify parent of change
        }}
      />
      {inputValue ? (
        <span className="color">{inputValue}</span>
      ) : (
        <span className="placeholder">Add...</span>
      )}
    </div>
  );
}
