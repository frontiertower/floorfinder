
import { Blueprint } from './blueprints/floor-12';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '12';
export const name = 'Ethereum & Decentralized Tech';
export const level = 12;
export const rooms: RoomType[] = [
    {
        "id": "f12r1",
        "name": "Blockchain Dev Area",
        "floorId": "12",
        "notes": "Area for blockchain development and discussions.",
        "color": "rgba(255, 200, 200, .5)",
        "coords": [
            10,
            10,
            15,
            10
        ]
    }
];

interface Floor12Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor12: React.FC<Floor12Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {
   const roomData = rooms.find(room => room.id === 'f12r1');

  return (
    <g data-floor-id="12">
      <Blueprint />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={roomData.coords} // Use coords from roomData
          color={roomData.color} // Use color from roomData
          notes={roomData.notes}
          floorId={id} // Use the floor's constant id
          viewBox={viewBox}
          onMouseEnter={() => onMouseEnterRoom(roomData)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(roomData.id)}
        />
      )}
    </g>
  );
};
