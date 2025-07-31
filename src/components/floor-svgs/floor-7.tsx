import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '7';
export const name = 'Frontier Makerspace';
export const level = 7;

export const rooms: RoomType[] = [
  { id: 'f7r1', name: '3D Printing Zone', floorId: '7', notes: 'Equipped with 3D printers.' },
  { id: 'f7r2', name: 'Laser Cutting Area', floorId: '7', notes: 'Area for laser cutting.' },
];

interface Floor7Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor7: React.FC<Floor7Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="7">
      <CommonUpper />
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.id === 'f7r1' ? [5, 5, 10, 10] : [20, 5, 10, 10]} // Example coordinates
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
