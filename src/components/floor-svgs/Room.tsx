import React from 'react';
import type { Room as RoomType } from '@/lib/types';

interface RoomProps {
  id: string;
  name: string;
  coords: [number, number, number, number]; // [x, y, width, height]
  color?: string; // Optional color prop
  notes?: string;
  floorId: string; // Add floorId here
  onMouseEnter?: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeave?: () => void;
  onClick?: () => void; // Add onClick here
}
export const Room: React.FC<RoomProps> = ({ id, name, coords, color = 'rgba(100, 100, 100, .5)', notes, onMouseEnter, onMouseLeave, onClick, floorId }) => {
  const [x, y, width, height] = coords;

  // Calculate text position for the center of the rectangle
  const textX = x + width / 2;
  const textY = y + height / 2;

  // Calculate font size based on room width (adjust multiplier as needed)
  const fontSize = width * 0.15;

  const handleMouseEnter = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (onMouseEnter) {
      onMouseEnter({ id, name, floorId, notes, coords, color }, { x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
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
        onClick={handleClick}
      />
      <text
        x={textX}
        y={textY}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fill="hsl(var(--foreground))"
        className="pointer-events-none"
      >
        {name}
      </text>
    </g>
  );
};
