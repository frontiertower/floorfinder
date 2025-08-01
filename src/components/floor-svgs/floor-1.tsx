
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { Blueprint } from './blueprints/floor-1';

export const id = '1';
export const name = 'Lobby';
export const level = 1;
export const rooms: Room[] = [
    {
        "id": "f1r1",
        "name": "Lobby",
        "floorId": "1",
        "coords": [
            2.5,
            2.5,
            20,
            20
        ],
        "color": "rgba(255, 255, 255, 1)"
    },
    {
        "id": "f1r2",
        "name": "Reception",
        "floorId": "1",
        "coords": [
            25,
            2.5,
            22.5,
            9.5
        ],
        "color": "rgba(255, 255, 255, 1)"
    },
    {
        "id": "f1r3",
        "name": "Mail Room",
        "floorId": "1",
        "coords": [
            25,
            13,
            22.5,
            9.5
        ],
        "color": "rgba(255, 255, 255, 1)"
    }
];

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor1 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g data-floor-id="1">
      <Blueprint />
      {rooms.map(room => (
        <g key={room.id} onClick={() => onRoomClick(room.id)}>
            <rect
                id={room.id}
                x={room.coords[0]}
                y={room.coords[1]}
                width={room.coords[2]}
                height={room.coords[3]}
                className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
                    'highlighted-room': highlightedRoomId === room.id,
                })}
            />
            <text 
                x={room.coords[0] + room.coords[2] / 2} 
                y={room.coords[1] + room.coords[3] / 2} 
                dominantBaseline="middle" 
                textAnchor="middle" 
                className="pointer-events-none font-sans text-[2.5px]">
                    {room.name}
            </text>
        </g>
      ))}
    </g>
  );
};
