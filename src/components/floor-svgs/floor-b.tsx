
import { CommonLower } from './common-lower';

export const FloorB = () => {
  return (
    <g>
      <CommonLower />
      <text x="250" y="125" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-4xl">Basement</text>
      <text x="250" y="165" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-2xl text-muted-foreground">(Parking & Utilities)</text>
    </g>
  );
};
