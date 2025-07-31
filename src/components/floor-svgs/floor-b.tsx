
import { CommonLower } from './blueprints/common-lower';
import type { Room } from '@/lib/types';

export const id = 'b';
export const name = 'Basement';
export const level = 0;
export const rooms: Room[] = [];

export const FloorB = () => {
  return (
    <g data-floor-id="b">
      <CommonLower />
      <text x="25" y="12.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[4px]">Basement</text>
      <text x="25" y="16.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px] text-muted-foreground">(Parking & Utilities)</text>
    </g>
  );
};
