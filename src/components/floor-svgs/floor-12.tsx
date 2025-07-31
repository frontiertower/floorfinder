import { CommonUpper } from './common-upper';
import type { Room } from '@/lib/types';

interface Floor12Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

export const Floor12: React.FC<Floor12Props> = ({ highlightedRoomId, onRoomClick, rooms }) => {
  return (
    <g>
      <CommonUpper />
    </g>
  );
};
