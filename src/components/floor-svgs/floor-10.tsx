import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '10';
export const name = 'Frontier @ Accerlate';
export const level = 10;

export const rooms: RoomType[] = [
  { id: 'f10r1', name: 'Accelerator Hot Desks', floorId: '10', notes: 'Flexible workspace for startups.' },
];

interface Floor10Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor10: React.FC<Floor10Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
  const roomData = rooms.find(room => room.id === 'f10r1');

  return (
    <g data-floor-id="10">
      <CommonUpper />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[15, 7, 10, 8]}
          color="rgba(255, 200, 255, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
