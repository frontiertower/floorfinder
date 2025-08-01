import { Blueprint } from './blueprints/floor-2';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '2';
export const name = 'Event Space';
export const level = 2;
export const rooms: RoomType[] = [
  {
      "id": "f2r1",
      "name": "Spaceship",
      "floorId": "2",
      "coords": [
          10,
          30,
          80,
          22
      ],
      "color": "rgba(255, 255, 255, 1)"
  },
  {
      "id": "f2r2",
      "name": "Green Room",
      "floorId": "2",
      "coords": [
          8,
          56,
          10,
          10
      ],
      "color": "rgba(255, 255, 255, 1)"
  },
];

interface Floor2Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string
}

export const Floor2: React.FC<Floor2Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {

  return (
    <g data-floor-id="2">
      <Blueprint />
      {/* Map over rooms array to render Room components */}
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords}
          color={room.color}
          notes={room.notes}
          viewBox={viewBox}
          floorId={id} // Use the floor's constant id
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
    </g>
  );
};
