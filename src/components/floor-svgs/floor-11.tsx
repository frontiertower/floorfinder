import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '11';
export const name = 'Health & Longevity';
export const level = 11;

export const rooms: RoomType[] = [
  { id: 'f11r1', name: 'Wellness Studio', floorId: '11', notes: 'Space for relaxation and wellness activities.' },
];

interface Floor11Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor11: React.FC<Floor11Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
   const roomData = rooms.find(room => room.id === 'f11r1');

  return (
    <g data-floor-id="11">
      <CommonUpper />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[20, 10, 8, 10]}
          color="rgba(200, 255, 255, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
