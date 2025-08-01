
import { Blueprint } from './blueprints/floor-13';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '13';
export const name = 'Applied Research';
export const level = 13;
export const rooms: RoomType[] = [];

interface Floor13Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType) => void;
  onMouseLeaveRoom: () => void;
  viewBox: string;
}
export const Floor13: React.FC<Floor13Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom, viewBox }) => {
  return (
    <g data-floor-id="13">
      <image height="50" width="50" href="https://upload.wikimedia.org/wikipedia/en/0/02/The_Thirteenth_Floor_poster.jpg" /> 
    </g>
  );
};
