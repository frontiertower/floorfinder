
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { CommonLower } from './common-lower';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const Floor2 = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  return (
    <g>
      <CommonLower />
      {/* Open Office Space */}
      <rect
        id="f2r1"
        x="2.5" y="2.5" width="45" height="15"
        onClick={() => onRoomClick('f2r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f2r1',
        })}
      />
      <text x="25" y="10" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f2r1')?.name}</text>

      {/* Conference Room */}
      <rect
        id="f2r2"
        x="2.5" y="18.5" width="22" height="4"
        onClick={() => onRoomClick('f2r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f2r2',
        })}
      />
      <text x="13.5" y="20.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f2r2')?.name}</text>

      {/* Kitchenette */}
      <rect
        id="f2r3"
        x="25.5" y="18.5" width="22" height="4"
        onClick={() => onRoomClick('f2r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
          'highlighted-room': highlightedRoomId === 'f2r3',
        })}
      />
      <text x="36.5" y="20.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">{getRoomById('f2r3')?.name}</text>
    </g>
  );
};
