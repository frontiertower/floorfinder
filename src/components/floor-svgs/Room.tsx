import React from 'react';
import type { Room as RoomType } from '@/lib/types';

interface RoomProps extends RoomType {
  coords: [number, number, number, number]; // [x, y, width, height]
  color?: string; // Optional color prop
  // notes prop is already in RoomType
}

export const Room: React.FC<RoomProps> = ({ id, name, coords, color = 'rgba(100, 100, 100, .5)', notes }) => {
  const [x, y, width, height] = coords;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      stroke="black"
      strokeWidth="0.25"
      data-room-id={id} // Add data attribute for room id
      data-room-name={name} // Add data attribute for room name
    />
  );
};
