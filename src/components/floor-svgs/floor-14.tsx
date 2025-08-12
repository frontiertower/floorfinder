
import { Blueprint } from './blueprints/floor-14';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';
import React from 'react';

export const id = '14';
export const name = 'Human Flourishing';
export const level = 14;
export const rooms: RoomType[] = [];

interface Floor14Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}

export const Floor14: React.FC<Floor14Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {

  return (
    <g data-floor-id="14">
      <Blueprint />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords} // Use coords from roomData
          color={room.color} // Use color from roomData
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
