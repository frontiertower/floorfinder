import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '16';
export const name = 'd/acc Lounge';
export const level = 16;

export const rooms: RoomType[] = [
  { id: 'f16r1', name: 'Lounge', floorId: '16', notes: 'Relaxation and social area.' },
  { id: 'f16r2', name: 'Dinning Hall', floorId: '16', notes: 'Group lunches and dinners are here.' },
];

interface Floor16Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor16: React.FC<Floor16Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
  const roomData = rooms.find(room => room.id === 'f16r1');

  return (
    <g data-floor-id="16">
      <CommonUpper />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[45, 20, 30, 20]}
          color="rgba(200, 200, 255, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
