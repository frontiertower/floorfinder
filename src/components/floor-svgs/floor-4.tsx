import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '4';
export const name = 'Robotics & Hard Tech';
export const level = 4;

export const rooms: RoomType[] = [
  {
    id: 'f4r1',
    name: 'Robotics Lab',
    // Removed floorId: '4',
    notes: 'This is the main robotics laboratory on floor 4.',
    color: 'rgba(255, 200, 200, .5)',
    coords: [33, 6, 13, 13],
  },
  // Add other rooms for floor 4 here
];

interface Floor4Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor4: React.FC<Floor4Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="4">
      <CommonUpper />
      {/* Map over rooms array to render Room components */}
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords}
          color={room.color}
          notes={room.notes}
          floorId={id} // Use the floor's constant id
          onMouseEnter={(e: React.MouseEvent<SVGElement>) => onMouseEnterRoom(room, { x: e.clientX, y: e.clientY })} // Pass room and event position
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
