import React, { useRef, useEffect } from 'react';
import type { Room as RoomType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomHoverCardProps {
  room: RoomType | null;
  position: { x: number; y: number } | null;
}

export const RoomHoverCard: React.FC<RoomHoverCardProps> = ({ room, position }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!room || !position) return null;

  // Assume floor selector width is 200px for demonstration
  const floorSelectorWidth = 350; // Estimated width of the floor selector

  const style = {
    top: `${position.y}px`,
    left: `${position.x - floorSelectorWidth}px`, // Add floor selector width to the left position
  };
  console.log(position);

  return (
    <AnimatePresence>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.1 }}
        className="absolute z-10 p-3 bg-card text-card-foreground rounded-md shadow-lg pointer-events-none"
        style={style}
      >
        <h3 className="font-bold text-sm mb-1">{room.name}</h3>
        {room.notes && (
          <p className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: room.notes }} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
