
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '14';
export const name = 'Human Flourishing';
export const level = 14;

interface Floor14Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor14: React.FC<Floor14Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
   const roomData = rooms.find(room => room.id === 'f14r1');

  return (
    <g data-floor-id="14">
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
