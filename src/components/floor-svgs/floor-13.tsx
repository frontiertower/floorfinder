import { CommonUpper } from './common-upper';
import type { Room } from '@/lib/types';

interface Floor13Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

export const Floor13: React.FC<Floor13Props> = ({ highlightedRoomId, onRoomClick, rooms }) => {
  return (
    <g>
      <CommonUpper />
    </g>
  );
};
