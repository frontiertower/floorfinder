
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const FloorRoof = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="hsl(var(--muted))" stroke="black" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="30" fill="hsl(var(--card))" stroke="black" strokeWidth="0.2" />
      <text x="50" y="45" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[5px]">Roof</text>
      
      {/* Maintenance Access */}
      <rect
        id="roof-access"
        x="45" y="25" width="10" height="10"
        onClick={() => onRoomClick('roof-access')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'roof-access',
        })}
      />
      <text x="50" y="30" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2px]">{getRoomById('roof-access')?.name}</text>
    </g>
  );
};
