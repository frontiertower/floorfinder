
import { CommonUpper } from './blueprints/common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '8';
export const name = 'Neurotech & Biotech';
export const level = 8;
export const rooms: RoomType[] = [
    {
        "id": "f8r1",
        "name": "Neuroscience Lab",
        "floorId": "8",
        "notes": "Lab for neuroscience research.",
        "color": "rgba(200, 200, 200, .5)",
        "coords": [
            5,
            5,
            10,
            10
        ]
    },
    {
        "id": "f8r2",
        "name": "Biotech Lab",
        "floorId": "8",
        "notes": "Lab for biotechnology research.",
        "color": "rgba(200, 200, 200, .5)",
        "coords": [
            20,
            5,
            10,
            10
        ]
    }
];

interface Floor8Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
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
          onMouseEnter={() => onMouseEnterRoom(room)}
          onMouseLeave={onMouseLeaveRoom}
          onClick={() => onRoomClick(room.id)} // Use onRoomClick prop
        />
      ))}
    </g>
  );
};
