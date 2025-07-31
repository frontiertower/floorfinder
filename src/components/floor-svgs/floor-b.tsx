
import { CommonLower } from './common-lower';

export const FloorB = () => {
  return (
    <g>
      <CommonLower />
      <text x="25" y="12.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[4px]">Basement</text>
      <text x="25" y="16.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px] text-muted-foreground">(Parking & Utilities)</text>
    </g>
  );
};
