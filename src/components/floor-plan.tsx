
'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import type { Room } from '@/lib/types';
import { allFloors, floorComponentMap, upperFloorViewBox, lowerFloorViewBox } from '@/lib/config';

import { InfoBox } from './infobox';

import '../app/svg.css';

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const Grid = ({ viewBox }: { viewBox: string }) => {
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const [x, y, width, height] = viewBoxParts;

    const majorLines = [];
    const minorLines = [];

    // The floor plans are in meters, so grid lines are at 1m and 10m intervals.
    const majorGridSpacing = 10;
    const minorGridSpacing = 1;

    // Vertical lines
    for (let i = Math.ceil(x / minorGridSpacing) * minorGridSpacing; i <= x + width; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`v-maj-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`v-min-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    // Horizontal lines
    for (let i = Math.ceil(y / minorGridSpacing) * minorGridSpacing; i <= y + height; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`h-maj-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`h-min-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    return (
        <g className="pointer-events-none">
          <rect x={x + .25} y={y + .25} width={width - .5 } height={height - .5} fill="white" stroke="none" />
          {minorLines}
          {majorLines}
          <rect x={x + .25} y={y + .25} width={width - .5 } height={height - .5} fill="none" stroke="black" strokeWidth="0.25" />
        </g>
    );
};

interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number | null } | null>(null);
  
  const floor = useMemo(() => allFloors.find(f => f.id === floorId), [floorId]);
  const viewBox = useMemo(() => floor && floor.level < 4 ? lowerFloorViewBox : upperFloorViewBox, [floor]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();

    const paths = svg.querySelectorAll('path');
    
    paths.forEach((path, index) => {
        const pathRect = path.getBoundingClientRect();
        
        const isOutside = 
            pathRect.left < svgRect.left || 
            pathRect.right > svgRect.right || 
            pathRect.top < svgRect.top || 
            pathRect.bottom > svgRect.bottom;

        if (isOutside) {
            console.warn(`Path at index ${index} may be outside the SVG's visible area.`, {
                path: path,
                pathRect: { 
                    top: pathRect.top, 
                    right: pathRect.right, 
                    bottom: pathRect.bottom, 
                    left: pathRect.left, 
                    width: pathRect.width, 
                    height: pathRect.height 
                },
                svgRect: { 
                    top: svgRect.top, 
                    right: svgRect.right, 
                    bottom: svgRect.bottom, 
                    left: svgRect.left, 
                    width: svgRect.width, 
                    height: svgRect.height 
                }
            });
        }
    });
  }, [floorId]); // Re-run when floor changes


  const handleMouseEnterRoom = useCallback((room: Room) => {
    setHoveredRoom(room);
  }, []);

  const handleMouseLeaveRoom = useCallback(() => {
    setHoveredRoom(null);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !viewBox) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const viewBoxHeight = viewBoxParts[3];

    setCoords({
      x: svgPoint.x,
      y: viewBoxParts[1] + viewBoxHeight - svgPoint.y, // Invert Y and offset by viewbox start
      z: floor?.level ?? null
    });
  }, [floor, viewBox]);

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
  }, []);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  const floorName = useMemo(() => floor?.name || 'Unknown Floor', [floor]);

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <InfoBox floor={floor?.level}  floorName={floorName} coords={coords} hoveredRoom={hoveredRoom} />
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full absolute p-10"
      >
          <Grid viewBox={viewBox} />
          <FloorComponent
            highlightedRoomId={highlightedRoomId}
            onRoomClick={onRoomClick}
            rooms={rooms}
            viewBox={viewBox}
            onMouseEnterRoom={handleMouseEnterRoom}
            onMouseLeaveRoom={handleMouseLeaveRoom}
          />
      </svg>
    </div>
  );
};

export default FloorPlan;
