'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room, FloorData, Floor } from '@/lib/types';

import { Card } from '@/components/ui/card';
import { RoomHoverCard } from './floor-svgs/RoomHoverCard'; // Keep RoomHoverCard import
import { Infobox } from './floor-svgs/Infobox'; // Import Infobox

// Statically import all floor components
import { Floor4, id as id4, name as name4, level as level4, rooms as rooms4 } from './floor-svgs/floor-4';
import { Floor5, id as id5, name as name5, level as level5, rooms as rooms5 } from './floor-svgs/floor-5';
import { Floor6, id as id6, name as name6, level as level6, rooms as rooms6 } from './floor-svgs/floor-6';
import { Floor7, id as id7, name as name7, level as level7, rooms as rooms7 } from './floor-svgs/floor-7';
import { Floor8, id as id8, name as name8, level as level8, rooms as rooms8 } from './floor-svgs/floor-8';
import { Floor9, id as id9, name as name9, level as level9, rooms as rooms9 } from './floor-svgs/floor-9';
import { Floor10, id as id10, name as name10, level as level10, rooms as rooms10 } from './floor-svgs/floor-10';
import { Floor11, id as id11, name as name11, level as level11, rooms as rooms11 } from './floor-svgs/floor-11';
import { Floor12, id as id12, name as name12, level as level12, rooms as rooms12 } from './floor-svgs/floor-12';
import { Floor14, id as id14, name as name14, level as level14, rooms as rooms14 } from './floor-svgs/floor-14';
import { Floor15, id as id15, name as name15, level as level15, rooms as rooms15 } from './floor-svgs/floor-15';
import { Floor16, id as id16, name as name16, level as level16, rooms as rooms16 } from './floor-svgs/floor-16';


import '../app/svg.css';


interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[]; // Rooms for the currently selected floor
}

const floorComponentMap: { [key: string]: React.ElementType<any> } = {
  '4': Floor4,
  '5': Floor5,
  '6': Floor6,
  '7': Floor7,
  '8': Floor8,
  '9': Floor9,
  '10': Floor10,
  '11': Floor11,
  '12': Floor12,
  '14': Floor14,
  '15': Floor15,
  '16': Floor16,
};

// Combine floor data from static imports
const allFloors: Floor[] = [
  { id: id4, name: name4, level: level4 },
  { id: id5, name: name5, level: level5 },
  { id: id6, name: name6, level: level6 },
  { id: id7, name: name7, level: level7 },
  { id: id8, name: name8, level: level8 },
  { id: id9, name: name9, level: level9 },
  { id: id10, name: name10, level: level10 },
  { id: id11, name: name11, level: level11 },
  { id: id12, name: name12, level: level12 },
  { id: id14, name: name14, level: level14 },
  { id: id15, name: name15, level: level15 },
  { id: id16, name: name16, level: level16 },
];


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
        <text x="5" y="-0.5" dominantBaseline="middle" textAnchor="middle" className="font-mono" fontSize="0.5px" fill="hsl(var(--foreground))">10ft</text>
      </g>
    );
  };


const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const viewBox = '0 0 95 60'; // Default to upper floor size
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [hoverCardPosition, setHoverCardPosition] = useState<{ x: number; y: number } | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number | null } | null>(null);

  const handleMouseEnterRoom = useCallback((room: Room, position: { x: number; y: number }) => { // Reverted to original signature
    setHoveredRoom(room);
    setHoverCardPosition(position);
  }, []);

  const handleMouseLeaveRoom = useCallback(() => {
    setHoveredRoom(null);
    setHoverCardPosition(null);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const viewBoxHeight = viewBoxParts[3];

    const currentFloor = allFloors.find(f => f.id === floorId);

    setCoords({
      x: svgPoint.x,
      y: viewBoxHeight - svgPoint.y, // Invert Y to make bottom-left the origin
      z: currentFloor?.level ?? null
    });
  }, [floorId, viewBox]);

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
  }, []);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);

  const isUpperFloor = useMemo(() => {
    // Use allFloors to find the current floor's level
    const floor = allFloors.find(f => f.id === floorId);
    return floor ? floor.level >= 4 : false; // Still needed for ruler positioning
  }, [floorId]);

  // Get the floor name for display
  const floorName = useMemo(() => {
    // Use allFloors to find the current floor's name
    const floor = allFloors.find(f => f.id === floorId);
    return floor ? floor.name : 'Unknown Floor';
  }, [floorId]);


  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-muted/20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {coords && (
        <div className="absolute top-2 right-2 bg-card/80 p-2 rounded-md text-xs font-mono z-10 pointer-events-none">
          <div>X: {coords.x.toFixed(2)} ft</div>
          <div>Y: {coords.y.toFixed(2)} ft</div>
          <div>Z: {coords.z}</div>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full absolute p-10"
      >
          <FloorComponent
            highlightedRoomId={highlightedRoomId}
            onRoomClick={onRoomClick}
            rooms={rooms} // Pass rooms for the current floor
            onMouseEnterRoom={handleMouseEnterRoom} // Pass the original handler
            onMouseLeaveRoom={handleMouseLeaveRoom}
          />

        {/* Floor Name Label */}
        <text
          x={3}
          y={4} // Y-coordinate near the top
          dominantBaseline="hanging"
          textAnchor="left"
          fontSize="3"
          fill="hsl(var(--foreground))"
          className="font-bold"
        >
          {floorName}
        </text>

        <g transform={`translate(75, 55)`}>
            <Ruler />
        </g>
      </svg>

      <RoomHoverCard room={hoveredRoom} position={hoverCardPosition} /> {/* Keep RoomHoverCard */}
    </div>
  );
};

export default FloorPlan;
