
'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room } from '@/lib/types';

import { Floor1 } from './floor-svgs/floor-1';
import { Floor2 } from './floor-svgs/floor-2';
import { FloorB } from './floor-svgs/floor-b';
import { Floor16 } from './floor-svgs/floor-16';
import { FloorRoof } from './floor-svgs/floor-roof';

interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  rooms: Room[];
}

const floorComponentMap: { [key: string]: React.ElementType<any> } = {
  '1': Floor1,
  '2': Floor2,
  'b': FloorB,
  '16': Floor16,
  'roof': FloorRoof,
};

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.5 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);

  const centerAndFit = () => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const initialScale = Math.min(width / 120, height / 120) * 0.9;
        setTransform({
            x: (width - 100 * initialScale) / 2,
            y: (height - 100 * initialScale) / 2,
            k: initialScale
        });
    }
  }

  useEffect(() => {
    centerAndFit();
    window.addEventListener('resize', centerAndFit);
    return () => window.removeEventListener('resize', centerAndFit);
  }, [floorId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setTransform((t) => ({ ...t, x: e.clientX - startPoint.x, y: e.clientY - startPoint.y }));
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.max(0.1, Math.min(10, transform.k + scaleAmount));
    const mouseX = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
    const mouseY = e.clientY - (containerRef.current?.getBoundingClientRect().top ?? 0);
    
    const newX = mouseX - (mouseX - transform.x) * (newScale / transform.k);
    const newY = mouseY - (mouseY - transform.y) * (newScale / transform.k);
    
    setTransform({ x: newX, y: newY, k: newScale });
  };
  
  const zoom = (direction: 'in' | 'out') => {
    const scaleFactor = 1.2;
    const newScale = direction === 'in' ? transform.k * scaleFactor : transform.k / scaleFactor;
    const clampedScale = Math.max(0.1, Math.min(10, newScale));
     if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;
        const newX = centerX - (centerX - transform.x) * (clampedScale / transform.k);
        const newY = centerY - (centerY - transform.y) * (clampedScale / transform.k);
        setTransform({ x: newX, y: newY, k: clampedScale });
    }
  };


  return (
    <div ref={containerRef} className="w-full h-full relative" onWheel={handleWheel}>
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <FloorComponent
              highlightedRoomId={highlightedRoomId}
              onRoomClick={onRoomClick}
              rooms={rooms}
            />
          </Suspense>
        </g>
      </svg>
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button size="icon" onClick={() => zoom('in')} aria-label="Zoom in">
          <ZoomIn />
        </Button>
        <Button size="icon" onClick={() => zoom('out')} aria-label="Zoom out">
          <ZoomOut />
        </Button>
        <Button size="icon" onClick={centerAndFit} aria-label="Reset view">
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
};

export default FloorPlan;
