import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '6';
export const name = 'Arts & Music';
export const level = 6;

export const rooms: RoomType[] = [
  { id: 'f6r1', name: 'Music Studio A', floorId: '6', notes: 'Equipped for recording and practice.' },
   { id: 'f6r2', name: 'Art Workshop', floorId: '6', notes: 'Space for various art projects.' },
];

interface Floor6Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor6: React.FC<Floor6Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="6">
      <CommonUpper />
       {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.id === 'f6r1' ? [5, 5, 10, 10] : [20, 5, 10, 10]} // Example coordinates
          color="rgba(200, 200, 255, .5)"
          notes={room.notes}
          floorId={room.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      ))}
    </g>
  );
};
