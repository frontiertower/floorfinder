
'use client';

import type { Room } from '@/lib/types';
import { Separator } from './ui/separator';

interface InfoBoxProps {
  floorName: string;
  coords: { x: number; y: number; z: number | null } | null;
  hoveredRoom: Room | null;
}

export const InfoBox = ({ floorName, coords, hoveredRoom }: InfoBoxProps) => {
  return (
    <div className="absolute top-4 right-4 bg-card p-3 rounded-lg shadow-lg w-64 text-sm z-10 pointer-events-none border border-border">
      <h2 className="font-headline text-lg mb-2">{floorName}</h2>
      <div className="font-mono text-xs space-y-0.5 text-muted-foreground">
        <div>X: {coords ? coords.x.toFixed(2) : '-'}m</div>
        <div>Y: {coords ? coords.y.toFixed(2) : '-'}m</div>
        <div>Z: {coords ? coords.z : '-'}</div>
      </div>
      
      {hoveredRoom && (
        <>
          <Separator className="my-2" />
          <div>
            <h3 className="font-bold text-sm mb-1">{hoveredRoom.name}</h3>
            <p className="text-xs text-muted-foreground">ID: {hoveredRoom.id}</p>
            {hoveredRoom.notes && (
              <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: hoveredRoom.notes }} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
