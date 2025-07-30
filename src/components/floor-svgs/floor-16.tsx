
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor16 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="hsl(var(--card))" stroke="black" strokeWidth="0.5" />
      
      {/* Penthouse Living Area */}
      <rect
        id="f16r1"
        x="5" y="5" width="90" height="50"
        onClick={() => onRoomClick('f16r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f16r1',
        })}
      />
      <text x="50" y="30" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f16r1')?.name}</text>

      {/* Sky Garden */}
      <rect
        id="f16r2"
        x="5" y="60" width="90" height="35"
        onClick={() => onRoomClick('f16r2')}
        className={cn('clickable-room fill-green-100 stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f16r2',
        })}
      />
      <text x="50" y="77.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f16r2')?.name}</text>
    </g>
  );
};
