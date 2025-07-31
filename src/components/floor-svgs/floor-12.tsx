
import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '12';
export const name = 'Ethereum & Decentralized Tech';
export const level = 12;

interface Floor12Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor12: React.FC<Floor12Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
   const roomData = rooms.find(room => room.id === 'f12r1');

  return (
    <g data-floor-id="12">
      <CommonUpper />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={roomData.coords} // Use coords from roomData
          color={roomData.color} // Use color from roomData
          notes={roomData.notes}
          floorId={id} // Use the floor's constant id
          onMouseEnter={() => onMouseEnterRoom(roomData)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(roomData.id)}
        />
      )}
    </g>
  );
};
