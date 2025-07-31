import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '8';
export const name = 'Neurotech & Biotech';
export const level = 8;

export const rooms: RoomType[] = [
  { id: 'f8r1', name: 'Neuroscience Lab', floorId: '8', notes: 'Lab for neuroscience research.' },
   { id: 'f8r2', name: 'Biotech Lab', floorId: '8', notes: 'Lab for biotechnology research.' },
];

interface Floor8Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor8: React.FC<Floor8Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="8">
      <CommonUpper />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.id === 'f8r1' ? [5, 5, 10, 10] : [20, 5, 10, 10]} // Example coordinates
          color="rgba(200, 200, 200, .5)"
          notes={room.notes}
          floorId={room.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      ))}
    </g>
  );
};
