import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '15';
export const name = 'Coworking & Library';
export const level = 15;

export const rooms: RoomType[] = [
  { id: 'f15r1', name: 'Coworking Space', floorId: '15', notes: 'Open area with desks for coworking.' },
  { id: 'f15r2', name: 'Library', floorId: '15', notes: 'Quiet area for reading and focus.' },
];

interface Floor15Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor15: React.FC<Floor15Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="15">
      <CommonUpper />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.id === 'f15r1' ? [5, 5, 15, 15] : [25, 5, 10, 15]} // Example coordinates
          color="rgba(255, 255, 200, .5)"
          notes={room.notes}
          floorId={room.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      ))}
    </g>
  );
};
