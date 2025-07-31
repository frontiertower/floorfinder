import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '12';
export const name = 'Ethereum & Decentralized Tech';
export const level = 12;

export const rooms: RoomType[] = [
  { id: 'f12r1', name: 'Blockchain Dev Area', floorId: '12', notes: 'Area for blockchain development and discussions.' },
];

interface Floor12Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor12: React.FC<Floor12Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
   const roomData = rooms.find(room => room.id === 'f12r1');

  return (
    <g data-floor-id="12">
      <CommonUpper />
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[10, 10, 15, 10]}
          color="rgba(255, 200, 200, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
