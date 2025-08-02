
import { Blueprint } from './blueprints/floor-14';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '14';
export const name = 'Human Flourishing';
export const level = 14;
export const rooms: RoomType[] = [
];

interface Floor14Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor14: React.FC<Floor14Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {
   const roomData = rooms.find(room => room.id === 'f14r1');

  return (
    <g data-floor-id="14">
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
