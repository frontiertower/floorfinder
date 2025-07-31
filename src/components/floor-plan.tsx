
'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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

const Ruler = ({ scale }: { scale: number }) => {
  const rulerWidthPixels = scale; // 1 meter in SVG units is scaled by 'scale'
  return (
    <div className="flex flex-col items-center">
      <div style={{ width: `${rulerWidthPixels}px` }} className="relative h-4">
        <div className="absolute bottom-0 left-0 h-2 w-px bg-foreground"></div>
        <div className="absolute bottom-0 right-0 h-2 w-px bg-foreground"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-foreground"></div>
      </div>
      <p className="text-xs font-mono">1m</p>
    </div>
  );
};


const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const [viewBox, setViewBox] = useState('0 0 50 25');
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  
  const isUpperFloor = useMemo(() => {
    const floor = ['4', '5', '16', 'roof'].includes(floorId);
    return floor;
  }, [floorId]);

  const centerAndFit = () => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const VBox = (isUpperFloor ? '0 0 30 15' : '0 0 50 25').split(' ').map(Number);
        const [vbX, vbY, vbWidth, vbHeight] = VBox;

        const scaleX = width / vbWidth;
        const scaleY = height / vbHeight;
        const scale = Math.min(scaleX, scaleY) * 0.9;

        const x = (width - vbWidth * scale) / 2;
        const y = (height - vbHeight * scale) / 2;
        
        setTransform({ x, y, k: scale });
    }
  }

  useEffect(() => {
    setViewBox(isUpperFloor ? '0 0 30 15' : '0 0 50 25');
    centerAndFit();
  }, [floorId, isUpperFloor]);

  useEffect(() => {
    centerAndFit(); 

    window.addEventListener('resize', centerAndFit);
    return () => window.removeEventListener('resize', centerAndFit);
  }, [isUpperFloor, centerAndFit]);

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
    if (!containerRef.current) return;
  
    const { left, top } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
  
    const scaleAmount = 1 - e.deltaY * 0.001;
    const newScale = transform.k * scaleAmount;

    const VBox = (isUpperFloor ? '0 0 30 15' : '0 0 50 25').split(' ').map(Number);
    const [vbX, vbY, vbWidth, vbHeight] = VBox;
    const maxScale = Math.min(containerRef.current.clientWidth / vbWidth, containerRef.current.clientHeight / vbHeight) * 5;
    const minScale = Math.min(containerRef.current.clientWidth / vbWidth, containerRef.current.clientHeight / vbHeight) * 0.5;

    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
  
    const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.k);
    const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.k);
  
    setTransform({ x: newX, y: newY, k: clampedScale });
  };
  
  const zoom = (direction: 'in' | 'out') => {
    if (!containerRef.current) return;
    const scaleFactor = 1.2;
    const newScale = direction === 'in' ? transform.k * scaleFactor : transform.k / scaleFactor;
    
    const VBox = (isUpperFloor ? '0 0 30 15' : '0 0 50 25').split(' ').map(Number);
    const [vbX, vbY, vbWidth, vbHeight] = VBox;
    const maxScale = Math.min(containerRef.current.clientWidth / vbWidth, containerRef.current.clientHeight / vbHeight) * 5;
    const minScale = Math.min(containerRef.current.clientWidth / vbWidth, containerRef.current.clientHeight / vbHeight) * 0.5;

    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    const newX = centerX - (centerX - transform.x) * (clampedScale / transform.k);
    const newY = centerY - (centerY - transform.y) * (clampedScale / transform.k);
    setTransform({ x: newX, y: newY, k: clampedScale });
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-muted/20" onWheel={handleWheel}>
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        className="w-full h-full absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <g style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`}}>
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <FloorComponent
              highlightedRoomId={highlightedRoomId}
              onRoomClick={onRoomClick}
              rooms={rooms}
            />
          </Suspense>
        </g>
      </svg>
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <Card className="px-3 py-2 text-sm text-muted-foreground shadow-lg">
           <Ruler scale={transform.k} />
        </Card>
        <div className="flex flex-col space-y-2">
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
    </div>
  );
};

export default FloorPlan;
