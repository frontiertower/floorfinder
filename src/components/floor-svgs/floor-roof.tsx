
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { CommonUpper } from './common-upper';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const FloorRoof = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <CommonUpper />
      <circle cx="15" cy="7.5" r="5" fill="hsl(var(--card))" stroke="black" strokeWidth="0.1" />
      <text x="15" y="7" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">Roof</text>
      
      {/* Maintenance Access */}
      <rect
        id="roof-access"
        x="12.5" y="2.5" width="5" height="2"
        onClick={() => onRoomClick('roof-access')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'roof-access',
        })}
      />
      <text x="15" y="3.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[1.2px]">{getRoomById('roof-access')?.name}</text>
    </g>
  );
};
