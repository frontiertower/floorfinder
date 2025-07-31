
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { Floor2Blueprint } from './blueprints/floor-2';

export const id = '2';
export const name = 'Spaceship';
export const level = 2;

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor2 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <Floor2Blueprint />
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
