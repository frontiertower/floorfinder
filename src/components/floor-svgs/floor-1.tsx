
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
        x="25" y="25" width="200" height="200"
        onClick={() => onRoomClick('f1r1')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r1',
        })}
      />
      <text x="125" y="125" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f1r1')?.name}</text>

      {/* Reception */}
      <rect
        id="f1r2"
        x="250" y="25" width="225" height="95"
        onClick={() => onRoomClick('f1r2')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r2',
        })}
      />
       <text x="362.5" y="72.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f1r2')?.name}</text>

      {/* Mail Room */}
      <rect
        id="f1r3"
        x="250" y="130" width="225" height="95"
        onClick={() => onRoomClick('f1r3')}
        className={cn('clickable-room fill-white stroke-black stroke-[0.2]', {
          'highlighted-room': highlightedRoomId === 'f1r3',
        })}
      />
      <text x="362.5" y="177.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl">{getRoomById('f1r3')?.name}</text>
    </g>
  );
};
