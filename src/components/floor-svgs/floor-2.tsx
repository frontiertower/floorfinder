
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor2 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="hsl(var(--card))" stroke="black" strokeWidth="0.5" />
      
      {/* Open Office Space */}
      <rect
        id="f2r1"
        x="5" y="5" width="90" height="60"
        onClick={() => onRoomClick('f2r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r1',
        })}
      />
      <text x="50" y="35" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f2r1')?.name}</text>

      {/* Conference Room */}
      <rect
        id="f2r2"
        x="5" y="70" width="40" height="25"
        onClick={() => onRoomClick('f2r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r2',
        })}
      />
      <text x="25" y="82.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f2r2')?.name}</text>

      {/* Kitchenette */}
      <rect
        id="f2r3"
        x="50" y="70" width="45" height="25"
        onClick={() => onRoomClick('f2r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r3',
        })}
      />
      <text x="72.5" y="82.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px]">{getRoomById('f2r3')?.name}</text>
    </g>
  );
};
