
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
    </g>
  );
};
