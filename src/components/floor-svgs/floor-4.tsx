import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const rooms: RoomType[] = [
  { id: 'f4r1', name: 'Robotics Lab', floorId: '4' },
];

export const Floor4 = () => {
  return (
    <g data-floor-id="4">
      <CommonUpper />
      {/* Use the Room component */}
      <Room
        id="f4r1"
        name="Robotics Lab"
        coords={[33, 6, 13, 13]}
        color="rgba(255, 200, 200, .5)"
        notes="This is the main robotics laboratory on floor 4."
        floorId="4"
      />
    </g>
  );
};
