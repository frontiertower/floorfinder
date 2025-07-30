
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
        x="25" y="25" width="450" height="150"
        onClick={() => onRoomClick('f2r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r1',
        })}
      />
      <text x="250" y="100" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f2r1')?.name}</text>

      {/* Conference Room */}
      <rect
        id="f2r2"
        x="25" y="185" width="220" height="40"
        onClick={() => onRoomClick('f2r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r2',
        })}
      />
      <text x="135" y="205" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f2r2')?.name}</text>

      {/* Kitchenette */}
      <rect
        id="f2r3"
        x="255" y="185" width="220" height="40"
        onClick={() => onRoomClick('f2r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f2r3',
        })}
      />
      <text x="365" y="205" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f2r3')?.name}</text>
    </g>
  );
};
