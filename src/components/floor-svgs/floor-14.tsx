import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '14';
export const name = 'Human Flourishing';
export const level = 14;

export const rooms: RoomType[] = [
  { id: 'f14r1', name: 'Meditation and Quiet Zone', floorId: '14', notes: 'A space for quiet reflection and meditation.' },
];

interface Floor14Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
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
          coords={[18, 8, 10, 12]}
          color="rgba(200, 255, 200, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
