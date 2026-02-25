import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface CustomColorPickerProps {
  initialColor: string; // This expects a full gradient string or basic hex
  onChange: (gradient: string) => void;
}

export const CustomColorPicker = ({
  initialColor,
  onChange,
}: CustomColorPickerProps) => {
  const t = useTranslations("Banner");

  const DIRECTIONS = [
    { label: t("directions.ltr"), value: "90deg" },
    { label: t("directions.rtl"), value: "-90deg" },
    { label: t("directions.ttb"), value: "180deg" },
    { label: t("directions.btt"), value: "0deg" },
  ];

  // Parse initial state
  const parseInitialState = (str: string) => {
    let hex = "#000000";
    let deg = "90deg";

    if (str?.startsWith("linear-gradient")) {
      const hexMatch = str.match(/#(?:[0-9a-fA-F]{3}){1,2}/);
      if (hexMatch) hex = hexMatch[0];

      const degMatch = str.match(/(-?\d+deg)/);
      if (degMatch) deg = degMatch[0];
    }

    return { hex, deg };
  };

  const initialState = parseInitialState(initialColor);
  const [color, setColor] = useState(initialState.hex);
  const [direction, setDirection] = useState(initialState.deg);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newState = parseInitialState(initialColor);
    // Only update internal state if significantly different to avoid loop,
    // but for now simpler is just to let user drive changes.
    // Actually, we shouldn't reset state on every initialColor change if it comes from our own onChange
    // So we invoke this only once or rely on internal state mostly.
  }, []);

  const updateGradient = (newHex: string, newDeg: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // Construct standard gradient string
      const gradient = `linear-gradient(${newDeg}, ${newHex}E6 0%, ${newHex}66 50%, transparent 100%)`;
      onChange(gradient);
    }, 100);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setColor(newHex);
    updateGradient(newHex, direction);
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeg = e.target.value;
    setDirection(newDeg);
    updateGradient(color, newDeg);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("form.chooseColor")}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            title={t("form.chooseColor")}
            value={color}
            onChange={handleColorChange}
            className="h-10 w-20 cursor-pointer rounded border p-1"
          />
          <div className="text-sm text-gray-500">{t("form.colorDesc")}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("form.direction")}
        </label>
        <select
          title={t("form.direction")}
          value={direction}
          onChange={handleDirectionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {DIRECTIONS.map((dir) => (
            <option key={dir.value} value={dir.value}>
              {dir.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
