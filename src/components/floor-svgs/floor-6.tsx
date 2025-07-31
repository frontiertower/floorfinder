import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const rooms: RoomType[] = [
  // Add rooms for floor 6 here
];

export const Floor6 = () => {
  return (
    <g data-floor-id="6">
      <CommonUpper />
    </g>
  );
};
