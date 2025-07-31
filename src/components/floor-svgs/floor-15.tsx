import { CommonUpper } from './common-upper';
import type { Room } from '@/lib/types';

interface Floor15Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

export const Floor15: React.FC<Floor15Props> = ({ highlightedRoomId, onRoomClick, rooms }) => {
  return (
    <g>
      <CommonUpper />
    </g>
  );
};
