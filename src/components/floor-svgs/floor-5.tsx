
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '5';
export const name = 'Movement & Fitness';
export const level = 5;
export const rooms: RoomType[] = [
    {
        "id": "f5r1",
        "name": "Fitness Area",
        "floorId": "5",
        "notes": "Exercise equipment and open space for activities.",
        "color": "rgba(200, 255, 200, .5)",
        "coords": [
            10,
            5,
            15,
            8
        ]
    }
];

interface Floor5Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor5: React.FC<Floor5Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {

  return (
    <g data-floor-id="5">
      <CommonUpper />
       {/* Map over rooms array to render Room components */}
       {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords} // Use coords from room data
          color={room.color} // Use color from room data
          notes={room.notes}
          floorId={id} // Use the floor's constant id
          viewBox={viewBox}
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)} // Use onRoomClick prop
        />
      ))}
    </g>
  );
};
