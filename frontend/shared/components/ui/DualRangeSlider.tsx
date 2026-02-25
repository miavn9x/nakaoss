"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = "",
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Synchronize internal state with props
  useEffect(() => {
    if (value[0] !== minValRef.current || value[1] !== maxValRef.current) {
      setMinVal(value[0]);
      setMaxVal(value[1]);
      minValRef.current = value[0];
      maxValRef.current = value[1];
    }
  }, [value]);

  return (
    <div className={`relative w-full h-10 flex items-center ${className}`}>
      {/* Hidden Range Inputs for Accessibility/Logic */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - step);
          setMinVal(value);
          minValRef.current = value;
          onChange([value, maxVal]);
        }}
        className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-3 appearance-none bg-transparent"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + step);
          setMaxVal(value);
          maxValRef.current = value;
          onChange([minVal, value]);
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-4 appearance-none bg-transparent"
      />

      {/* Visual Slider Track */}
      <div className="relative w-full">
        <div className="absolute h-1.5 w-full rounded-full bg-gray-200 z-1" />
        <div
          ref={range}
          className="absolute h-1.5 rounded-full bg-[#E31837] z-2"
        />
      </div>

      <style jsx global>{`
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #e31837;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          margin-top: 5px; /* visual adjustment */
        }
        .thumb::-moz-range-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #e31837;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DualRangeSlider;
