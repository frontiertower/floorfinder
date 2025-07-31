
'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room, FloorData } from '@/lib/types';

// Import the config data
import { floorData } from '@/config';

import { Card } from '@/components/ui/card';

// Commented out floors
// import { FloorB } from './floor-svgs/floor-b';
// import { Floor1 } from './floor-svgs/floor-1';
// import { Floor2 } from './floor-svgs/floor-2';
// import { Floor3 } from './floor-svgs/floor-3';

import { Floor4 } from './floor-svgs/floor-4';
import { Floor5 } from './floor-svgs/floor-5';
import { Floor6 } from './floor-svgs/floor-6';
import { Floor7 } from './floor-svgs/floor-7';
import { Floor8 } from './floor-svgs/floor-8';
import { Floor9 } from './floor-svgs/floor-9';
import { Floor10 } from './floor-svgs/floor-10';
import { Floor11 } from './floor-svgs/floor-11';
import { Floor12 } from './floor-svgs/floor-12';
// import { Floor13 } from './floor-svgs/floor-13'; // Commented out floor 13
import { Floor14 } from './floor-svgs/floor-14';
import { Floor15 } from './floor-svgs/floor-15';
import { Floor16 } from './floor-svgs/floor-16';
// import { FloorRoof } from './floor-svgs/floor-roof'; // Commented out roof

import '../app/svg.css';


interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

const floorComponentMap: { [key: string]: React.ElementType<any> } = {
  // Commented out floors
  // 'b': FloorB,
  // '1': Floor1,
  // '2': Floor2,
  // '3': Floor3,

  '4': Floor4,
  '5': Floor5,
  '6': Floor6,
  '7': Floor7,
  '8': Floor8,
  '9': Floor9,
  '10': Floor10,
  '11': Floor11,
  '12': Floor12,
  // '13': Floor13, // Commented out floor 13
  '14': Floor14,
  '15': Floor15,
  '16': Floor16,
  // 'roof': FloorRoof,
};

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const Ruler = () => {
    return (
      <g>
        <line x1="0" y1="0" x2="10" y2="0" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="0" y1="0" x2="0" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="10" y1="0" x2="10" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <text x="0.5" y="-0.5" dominantBaseline="middle" textAnchor="middle" className="font-mono" fontSize="0.5px" fill="hsl(var(--foreground))">10ft</text>
      </g>
    );
  };


const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const [viewBox, setViewBox] = useState('0 0 95 60'); // Default to upper floor size
  const containerRef = useRef<HTMLDivElement>(null);

  // Removed fetch for config.json

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  
  const isUpperFloor = useMemo(() => {
    // Use imported floorData
    const floor = floorData.floors.find(f => f.id === floorId);
    return floor ? floor.level >= 4 : false; // Still needed for ruler positioning
  }, [floorId]); // Removed floorData.floors from dependency array

  // Removed useEffect that set viewBox based on isUpperFloor

  // Get the floor name for display
  const floorName = useMemo(() => {
    // Use imported floorData
    const floor = floorData.floors.find(f => f.id === floorId);
    return floor ? floor.name : 'Unknown Floor';
  }, [floorId]); // Removed floorData.floors from dependency array


  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-muted/20">
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full absolute p-10"
      >
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <FloorComponent
            highlightedRoomId={highlightedRoomId}
            onRoomClick={onRoomClick}
            rooms={rooms}
          />
        </Suspense>

        {/* Floor Name Label */}
        <text
          x={viewBox.split(' ')[2] / 2 + 3} // X-coordinate at the horizontal center of the viewBox
          y={4} // Y-coordinate near the top
          dominantBaseline="hanging"
          textAnchor="left"
          fontSize="3"
          fill="hsl(var(--foreground))"
          className="font-bold"
        >
          {floorName}
        </text>

        <g transform={`translate(${isUpperFloor ? 75 : 45}, ${isUpperFloor ? 15 : 5})`}> {/* Adjusted translate values */}
            <Ruler />
        </g>
      </svg>
    </div>
  );
};

export default FloorPlan;
