import React from 'react';
import type { Room as RoomType } from '@/lib/types';

interface RoomProps extends RoomType {
  coords: [number, number, number, number]; // [x, y, width, height]
  color?: string; // Optional color prop
  onMouseEnter?: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeave?: () => void;
  notes?: string;
}

export const Room: React.FC<RoomProps> = ({ id, name, coords, color = 'rgba(100, 100, 100, .5)', notes, onMouseEnter, onMouseLeave, floorId }) => {
  const [x, y, width, height] = coords;

  // Calculate text position for the center of the rectangle
  const textX = x + width / 2;
  const textY = y + height / 2;

  // Calculate font size based on room width (adjust multiplier as needed)
  const fontSize = width * 0.15;

  const handleMouseEnter = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (onMouseEnter) {
      const rect = event.currentTarget.getBoundingClientRect();
      // Calculate position relative to the SVG container
      const position = {
        x: event.clientX - rect.left, // Adjust as needed for accurate positioning within SVG
        y: event.clientY - rect.top, // Adjust as needed
      };
      onMouseEnter({ id, name, floorId, notes }, { x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="black"
        strokeWidth="0.25"
        data-room-id={id}
        data-room-name={name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <text
        x={textX}
        y={textY}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fill="hsl(var(--foreground))" // Adjust text color as needed
        className="pointer-events-none"
      >
        {name}
      </text>
    </g>
  );
};
