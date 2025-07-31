
import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '11';
export const name = 'Health & Longevity';
export const level = 11;

interface Floor11Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor11: React.FC<Floor11Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="11">
      <CommonUpper />
      {/* Map over rooms array to render Room components */}
      {rooms.map(room => (
        <Room
          key={room.id}
          id={room.id}
          name={room.name}
          coords={room.coords} // Use coords from room data
          color={room.color} // Use color from room data
          notes={room.notes}
          floorId={id} // Use the floor's constant id
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)} // Use onRoomClick prop
        />
      ))}
    </g>
  );
};
