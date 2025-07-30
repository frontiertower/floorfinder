
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor1 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="hsl(var(--card))" stroke="black" strokeWidth="0.5" />
      
      {/* Lobby */}
      <rect
        id="f1r1"
        x="5" y="5" width="40" height="50"
        onClick={() => onRoomClick('f1r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r1',
        })}
      />
      <text x="25" y="30" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f1r1')?.name}</text>

      {/* Reception */}
      <rect
        id="f1r2"
        x="5" y="60" width="40" height="35"
        onClick={() => onRoomClick('f1r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r2',
        })}
      />
       <text x="25" y="77.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f1r2')?.name}</text>


      {/* Mail Room */}
      <rect
        id="f1r3"
        x="50" y="5" width="45" height="90"
        onClick={() => onRoomClick('f1r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r3',
        })}
      />
      <text x="72.5" y="50" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f1r3')?.name}</text>
    </g>
  );
};
