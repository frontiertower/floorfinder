
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '15';
export const name = 'Coworking & Library';
export const level = 15;
export const rooms: RoomType[] = [
    {
        "id": "f15r1",
        "floorId": "15",
        "name": "Coworking Space",
        "notes": "Open area with desks for coworking.",
        "color": "rgba(255, 255, 200, .5)",
        "coords": [
            5,
            5,
            15,
            15
        ]
    },
    {
        "id": "f15r2",
        "floorId": "15",
        "name": "Library",
        "notes": "Quiet area for reading and focus.",
        "color": "rgba(255, 255, 200, .5)",
        "coords": [
            25,
            5,
            10,
            15
        ]
    }
];

interface Floor15Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor15: React.FC<Floor15Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {

  return (
    <g data-floor-id="15">
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
          viewBox={viewBox}
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
