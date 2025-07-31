import { Floor2Blueprint } from './blueprints/floor-2';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '2';
export const name = 'Spaceship';
export const level = 2;
export const rooms: RoomType[] = [
    {
        "id": "f2r1",
        "name": "Open Office",
        "floorId": "2",
        "coords": [
            2.5,
            2.5,
            45,
            15
        ],
        "color": "rgba(255, 255, 255, 1)"
    },
    {
        "id": "f2r2",
        "name": "Conference Room",
        "floorId": "2",
        "coords": [
            2.5,
            18.5,
            22,
            4
        ],
        "color": "rgba(255, 255, 255, 1)"
    },
    {
        "id": "f2r3",
        "name": "Kitchenette",
        "floorId": "2",
        "coords": [
            25.5,
            18.5,
            22,
            4
        ],
        "color": "rgba(255, 255, 255, 1)"
    }
];

interface Floor2Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor2: React.FC<Floor2Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="2">
      <Floor2Blueprint />
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
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
