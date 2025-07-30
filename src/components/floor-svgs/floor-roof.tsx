
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
      <circle cx="150" cy="75" r="50" fill="hsl(var(--card))" stroke="black" strokeWidth="1" />
      <text x="150" y="70" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">Roof</text>
      
      {/* Maintenance Access */}
      <rect
        id="roof-access"
        x="125" y="25" width="50" height="20"
        onClick={() => onRoomClick('roof-access')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'roof-access',
        })}
      />
      <text x="150" y="35" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-base">{getRoomById('roof-access')?.name}</text>
    </g>
  );
};
