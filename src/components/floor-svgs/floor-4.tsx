
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '4';
export const name = 'Robotics & Hard Tech';
export const level = 4;
export const rooms: RoomType[] = [
    {
        "id": "f4r1",
        "floorId": "4",
        "name": "Robotics Lab",
        "notes": "This is the main robotics laboratory on floor 4.",
        "color": "rgba(255, 200, 200, .5)",
        "coords": [
            35,
            56,
            13,
            13
        ]
    }
];

interface Floor4Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor4: React.FC<Floor4Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {

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
          viewBox={viewBox}
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
