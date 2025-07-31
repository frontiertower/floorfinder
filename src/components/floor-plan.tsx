
'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room } from '@/lib/types';
import { Card } from '@/components/ui/card';

import { Floor1 } from './floor-svgs/floor-1';
import { Floor2 } from './floor-svgs/floor-2';
import { Floor3 } from './floor-svgs/floor-3';
import { Floor4 } from './floor-svgs/floor-4';
import { Floor5 } from './floor-svgs/floor-5';
import { FloorB } from './floor-svgs/floor-b';
import { Floor16 } from './floor-svgs/floor-16';
import { FloorRoof } from './floor-svgs/floor-roof';

interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

const floorComponentMap: { [key: string]: React.ElementType<any> } = {
  'b': FloorB,
  '1': Floor1,
  '2': Floor2,
  '3': Floor3,
  '4': Floor4,
  '5': Floor5,
  '16': Floor16,
  'roof': FloorRoof,
};

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const Ruler = () => {
    return (
      <g>
        <line x1="0" y1="0" x2="1" y2="0" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="0" y1="0" x2="0" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="1" y1="0" x2="1" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <text x="0.5" y="-0.5" dominantBaseline="middle" textAnchor="middle" className="font-mono" fontSize="0.5px" fill="hsl(var(--foreground))">1m</text>
      </g>
    );
  };


const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const [viewBox, setViewBox] = useState('0 0 50 25');
  const containerRef = useRef<HTMLDivElement>(null);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  
  const isUpperFloor = useMemo(() => {
    const floor = ['4', '5', '16', 'roof'].includes(floorId);
    return floor;
  }, [floorId]);

  useEffect(() => {
    setViewBox(isUpperFloor ? '0 0 30 15' : '0 0 50 25');
  }, [floorId, isUpperFloor]);


  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-muted/20">
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full absolute top-0 left-0"
      >
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <FloorComponent
            highlightedRoomId={highlightedRoomId}
            onRoomClick={onRoomClick}
            rooms={rooms}
          />
        </Suspense>
        <g transform={`translate(${isUpperFloor ? 28 : 48}, ${isUpperFloor ? 14 : 24})`}>
            <Ruler />
        </g>
      </svg>
    </div>
  );
};

export default FloorPlan;
