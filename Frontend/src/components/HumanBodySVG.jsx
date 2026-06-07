import React, { useState } from "react";

// A clean minimalist interactive SVG silhouette mapping
export default function HumanBodySVG({ onPartClick, selectedPart }) {
  const [hoveredPart, setHoveredPart] = useState(null);

  const handleMouseEnter = (part) => setHoveredPart(part);
  const handleMouseLeave = () => setHoveredPart(null);

  const getPathStyle = (partName) => {
    const isSelected = selectedPart === partName;
    const isHovered = hoveredPart === partName;
    return {
      fill: isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "#312e81", // Deep blue like user image
      stroke: "#ffffff",
      strokeWidth: "2",
      transition: "fill 0.3s ease",
      cursor: "pointer",
    };
  };

  const handleClick = (part) => {
    if (onPartClick) onPartClick(part);
  };

  return (
    <div className="w-full h-full flex items-center justify-center py-4">
      <svg
        viewBox="0 0 100 250"
        className="w-full max-w-[140px] h-auto drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <path
          d="M50 5C43 5 38 10 38 18C38 25 43 30 46 32V36H54V32C57 30 62 25 62 18C62 10 57 5 50 5Z"
          style={getPathStyle("Head")}
          onMouseEnter={() => handleMouseEnter("Head")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Head")}
        />

        {/* Chest */}
        <path
          d="M36 40C30 40 28 45 28 50L30 80H70L72 50C72 45 70 40 64 40H36Z"
          style={getPathStyle("Chest")}
          onMouseEnter={() => handleMouseEnter("Chest")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Chest")}
        />

        {/* Abdomen */}
        <path
          d="M30 82H70L66 115C66 120 60 125 50 125C40 125 34 120 34 115L30 82Z"
          style={getPathStyle("Abdomen")}
          onMouseEnter={() => handleMouseEnter("Abdomen")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Abdomen")}
        />

        {/* Left Arm */}
        <path
          d="M26 42C20 42 16 46 14 55L10 95C9 100 12 105 16 105C20 105 23 100 24 95L28 48H26Z"
          style={getPathStyle("Left Arm")}
          onMouseEnter={() => handleMouseEnter("Left Arm")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Left Arm")}
        />
        {/* Left Forearm */}
        <path
          d="M10 97L5 135C4 140 8 145 12 145C16 145 18 140 19 135L22 97H10Z"
          style={getPathStyle("Left Arm")}
          onMouseEnter={() => handleMouseEnter("Left Arm")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Left Arm")}
        />

        {/* Right Arm */}
        <path
          d="M74 42C80 42 84 46 86 55L90 95C91 100 88 105 84 105C80 105 77 100 76 95L72 48H74Z"
          style={getPathStyle("Right Arm")}
          onMouseEnter={() => handleMouseEnter("Right Arm")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Right Arm")}
        />
        {/* Right Forearm */}
        <path
          d="M90 97L95 135C96 140 92 145 88 145C84 145 82 140 81 135L78 97H90Z"
          style={getPathStyle("Right Arm")}
          onMouseEnter={() => handleMouseEnter("Right Arm")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Right Arm")}
        />

        {/* Left Leg */}
        <path
          d="M35 127C30 127 28 132 28 140L30 185H47L49 130C49 127 45 125 40 125C38 125 36 126 35 127Z"
          style={getPathStyle("Left Leg")}
          onMouseEnter={() => handleMouseEnter("Left Leg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Left Leg")}
        />
        {/* Left Calf */}
        <path
          d="M30 187L32 245C32 250 38 250 42 245L45 187H30Z"
          style={getPathStyle("Left Leg")}
          onMouseEnter={() => handleMouseEnter("Left Leg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Left Leg")}
        />

        {/* Right Leg */}
        <path
          d="M65 127C70 127 72 132 72 140L70 185H53L51 130C51 127 55 125 60 125C62 125 64 126 65 127Z"
          style={getPathStyle("Right Leg")}
          onMouseEnter={() => handleMouseEnter("Right Leg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Right Leg")}
        />
        {/* Right Calf */}
        <path
          d="M70 187L68 245C68 250 62 250 58 245L55 187H70Z"
          style={getPathStyle("Right Leg")}
          onMouseEnter={() => handleMouseEnter("Right Leg")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Right Leg")}
        />
      </svg>
    </div>
  );
}
