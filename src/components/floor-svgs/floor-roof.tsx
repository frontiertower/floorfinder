
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { CommonUpper } from './blueprints/common-upper';

export const id = 'roof';
export const name = 'Roof';
export const level = 17;
export const rooms: Room[] = [
    {
        "id": "roof-access",
        "name": "Maintenance Access",
        "floorId": "roof",
        "coords": [
            12.5,
            2.5,
            5,
            2
        ],
        "color": "rgba(255, 255, 255, 1)"
    }
];

interface FloorProps {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

export const FloorRoof = ({ highlightedRoomId, onRoomClick, rooms }: FloorProps) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  const maintenanceAccess = getRoomById('roof-access');

  return (
    <g>
      <circle cx="15" cy="7.5" r="5" fill="hsl(var(--card))" stroke="black" strokeWidth="0.1" />
      <text x="15" y="7" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[2.5px]">Roof</text>
      
      {maintenanceAccess && (
          <g onClick={() => onRoomClick('roof-access')}>
            <rect
                id="roof-access"
                x={maintenanceAccess.coords[0]} y={maintenanceAccess.coords[1]} width={maintenanceAccess.coords[2]} height={maintenanceAccess.coords[3]}
                className={cn('clickable-room fill-white stroke-black stroke-[0.02]', {
                'highlighted-room': highlightedRoomId === 'roof-access',
                })}
            />
            <text x="15" y="3.5" dominantBaseline="middle" textAnchor="middle" className="pointer-events-none font-sans text-[1.2px]">{maintenanceAccess.name}</text>
        </g>
      )}
    </g>
  );
};
