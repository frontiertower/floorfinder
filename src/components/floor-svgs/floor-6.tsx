import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '6';
export const name = 'Arts & Music';
export const level = 6;

export const rooms: RoomType[] = [
  {
    id: 'f6r1',
    name: 'Music Studio A',
    floorId: '6',
    notes: 'Equipped for recording and practice.',
    color: 'rgba(200, 200, 255, .5)', // Added color
    coords: [5, 5, 10, 10], // Added coords
  },
   {
     id: 'f6r2',
     name: 'Art Workshop',
     floorId: '6',
     notes: 'Space for various art projects.',
     color: 'rgba(200, 200, 255, .5)', // Added color
     coords: [20, 5, 10, 10], // Added coords
   },
];

interface Floor6Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor6: React.FC<Floor6Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="6">
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
          onMouseEnter={(e) => onMouseEnterRoom(room, { x: e.clientX, y: e.clientY })} // Pass room and event position
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)} // Use onRoomClick prop
        />
      ))}
    </g>
  );
};
