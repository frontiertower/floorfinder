import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '5';
export const name = 'Movement & Fitness';
export const level = 5;

export const rooms: RoomType[] = [
  { id: 'f5r1', name: 'Fitness Area', floorId: '5', notes: 'Exercise equipment and open space for activities.' },
];

interface Floor5Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor5: React.FC<Floor5Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
   const roomData = rooms.find(room => room.id === 'f5r1');

  return (
    <g data-floor-id="5">
      <CommonUpper />
       {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[10, 5, 15, 8]}
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
