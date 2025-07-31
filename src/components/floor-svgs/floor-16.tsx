
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '16';
export const name = 'd/acc Lounge';
export const level = 16;
export const rooms: RoomType[] = [
    {
        "id": "f16r1",
        "name": "Lounge",
        "floorId": "16",
        "notes": "Relaxation and social area.",
        "color": "rgba(200, 200, 255, .5)",
        "coords": [
            45,
            20,
            30,
            20
        ]
    },
    {
        "id": "f16r2",
        "name": "Dining Hall",
        "floorId": "16",
        "notes": "Group lunches and dinners are here.",
        "color": "rgba(200, 200, 255, .5)",
        "coords": [
            5,
            43,
            40,
            10
        ]
    }
];

interface Floor16Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor16: React.FC<Floor16Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="16">
      <CommonUpper />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords} // Use coords from room
          color={room.color} // Use color from room
          notes={room.notes}
          floorId={id} // Use the floor's constant id
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
