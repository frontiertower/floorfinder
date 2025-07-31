
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { CommonUpper } from './common-upper';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor16 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <CommonUpper />
      
      {/* Penthouse Living Area */}
      <rect
        id="f16r1"
        x="2.5" y="2.5" width="25" height="5"
        onClick={() => onRoomClick('f16r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f16r1',
        })}
      />
      <text x="15" y="5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f16r1')?.name}</text>

      {/* Sky Garden */}
      <rect
        id="f16r2"
        x="2.5" y="8.5" width="25" height="4"
        onClick={() => onRoomClick('f16r2')}
        className={cn('clickable-room fill-green-100 stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f16r2',
        })}
      />
      <text x="15" y="10.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f16r2')?.name}</text>
    </g>
  );
};
