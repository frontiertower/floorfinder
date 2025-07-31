
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { CommonLower } from './common-lower';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor1 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <CommonLower />
      {/* Lobby */}
      <rect
        id="f1r1"
        x="2.5" y="2.5" width="20" height="20"
        onClick={() => onRoomClick('f1r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f1r1',
        })}
      />
      <text x="12.5" y="12.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f1r1')?.name}</text>

      {/* Reception */}
      <rect
        id="f1r2"
        x="25" y="2.5" width="22.5" height="9.5"
        onClick={() => onRoomClick('f1r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f1r2',
        })}
      />
       <text x="36.25" y="7.25" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f1r2')?.name}</text>

      {/* Mail Room */}
      <rect
        id="f1r3"
        x="25" y="13" width="22.5" height="9.5"
        onClick={() => onRoomClick('f1r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f1r3',
        })}
      />
      <text x="36.25" y="17.75" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f1r3')?.name}</text>
    </g>
  );
};
