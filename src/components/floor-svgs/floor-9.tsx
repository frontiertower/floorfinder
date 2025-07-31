import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '9';
export const name = 'AI & Autonomous Systems';
export const level = 9;

export const rooms: RoomType[] = [
  {
    id: 'f9r1',
    name: 'AI Development Lab',
    floorId: id,
    notes: 'Lab for AI development.',
    color: 'rgba(200, 255, 255, .5)', // Added color
    coords: [5, 5, 10, 10], // Added coords
  },
   {
     id: 'f9r2',
     name: 'Autonomous Systems Lab',
     floorId: id,
     notes: 'Lab for autonomous systems.',
     color: 'rgba(200, 255, 255, .5)', // Added color
     coords: [20, 5, 10, 10], // Added coords
   },
];

interface Floor9Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor9: React.FC<Floor9Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {

  return (
    <g data-floor-id="9">
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
