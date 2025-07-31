import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '8';
export const name = 'Neurotech & Biotech';
export const level = 8;

export const rooms: RoomType[] = [
  {
    id: 'f8r1',
    name: 'Neuroscience Lab',
    floorId: id,
    notes: 'Lab for neuroscience research.',
    color: 'rgba(200, 200, 200, .5)', // Added color
    coords: [5, 5, 10, 10], // Added coords
  },
   {
     id: 'f8r2',
     name: 'Biotech Lab',
     floorId: id,
     notes: 'Lab for biotechnology research.',
     color: 'rgba(200, 200, 200, .5)', // Added color
     coords: [20, 5, 10, 10], // Added coords
   },
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
