
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '7';
export const name = 'Frontier Makerspace';
export const level = 7;

interface Floor7Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor7: React.FC<Floor7Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="7">
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
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)} // Use onRoomClick prop
        />
      ))}
    </g>
  );
};
