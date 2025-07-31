import { CommonUpper } from './common-upper';
import type { Room } from '@/lib/types';

interface Floor14Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

export const Floor14: React.FC<Floor14Props> = ({ highlightedRoomId, onRoomClick, rooms }) => {
  return (
    <g>
      <CommonUpper />
    </g>
  );
};
