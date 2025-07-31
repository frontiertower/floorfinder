import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '9';
export const name = 'AI & Autonomous Systems';
export const level = 9;

export const rooms: RoomType[] = [
  { id: 'f9r1', name: 'AI Development Lab', floorId: '9', notes: 'Lab for AI development.' },
   { id: 'f9r2', name: 'Autonomous Systems Lab', floorId: '9', notes: 'Lab for autonomous systems.' },
];

interface Floor9Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor9: React.FC<Floor9Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="9">
      <CommonUpper />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.id === 'f9r1' ? [5, 5, 10, 10] : [20, 5, 10, 10]} // Example coordinates
          color="rgba(200, 255, 255, .5)"
          notes={room.notes}
          floorId={room.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      ))}
    </g>
  );
};
