
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const FloorB = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="hsl(var(--card))" stroke="black" strokeWidth="0.5" />
      <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[5px]">Basement</text>
      <text x="50" y="60" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[3px] text-muted-foreground">(Parking & Utilities)</text>
    </g>
  );
};
