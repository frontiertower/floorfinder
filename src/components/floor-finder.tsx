'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Floor, Room, FloorData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Info } from 'lucide-react';

// Statically import all floor components
import * as Floor4 from './floor-svgs/floor-4';
import * as Floor5 from './floor-svgs/floor-5';
import * as Floor6 from './floor-svgs/floor-6';
import * as Floor7 from './floor-svgs/floor-7';
import * as Floor8 from './floor-svgs/floor-8';
import * as Floor9 from './floor-svgs/floor-9';
import * as Floor10 from './floor-svgs/floor-10';
import * as Floor11 from './floor-svgs/floor-11';
import * as Floor12 from './floor-svgs/floor-12';
import * as Floor14 from './floor-svgs/floor-14';
import * as Floor15 from './floor-svgs/floor-15';
import * as Floor16 from './floor-svgs/floor-16';

import FloorPlan from './floor-plan';
import RoomInfoDialog from './room-info-dialog';

// Combine floor and room data from static imports
const allFloors: Floor[] = [
  { id: Floor4.id, name: Floor4.name, level: Floor4.level },
  { id: Floor5.id, name: Floor5.name, level: Floor5.level },
  { id: Floor6.id, name: Floor6.name, level: Floor6.level },
  { id: Floor7.id, name: Floor7.name, level: Floor7.level },
  { id: Floor8.id, name: Floor8.name, level: Floor8.level },
  { id: Floor9.id, name: Floor9.name, level: Floor9.level },
  { id: Floor10.id, name: Floor10.name, level: Floor10.level },
  { id: Floor11.id, name: Floor11.name, level: Floor11.level },
  { id: Floor12.id, name: Floor12.name, level: Floor12.level },
  { id: Floor14.id, name: Floor14.name, level: Floor14.level },
  { id: Floor15.id, name: Floor15.name, level: Floor15.level },
  { id: Floor16.id, name: Floor16.name, level: Floor16.level },
];

const allRooms: Room[] = [
  ...Floor4.rooms,
  ...Floor5.rooms,
  ...Floor6.rooms,
  ...Floor7.rooms,
  ...Floor8.rooms,
  ...Floor9.rooms,
  ...Floor10.rooms,
  ...Floor11.rooms,
  ...Floor12.rooms,
  ...Floor14.rooms,
  ...Floor15.rooms,
  ...Floor16.rooms,
];


export default function FloorFinder() {
  // Initialize selectedFloorId to null
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomForInfo, setSelectedRoomForInfo] = useState<Room | null>(null);

  // Read hash from URL on mount and set the floor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#floor')) {
        const idFromHash = hash.substring(6);
        // Basic validation: check if the extracted id is a valid floor id
        if (allFloors.some(floor => floor.id === idFromHash)) {
           setSelectedFloorId(idFromHash);
        }
      }
    }
  }, [allFloors]); // Depend on allFloors


  const sortedFloors = useMemo(() => {
    // Filter out commented floors (b, 1, 2, 3, 13, roof) - already done by selecting which floors to import
    return [...allFloors].sort((a, b) => b.level - a.level);
  }, [allFloors]);

  const searchResults = useMemo<Room[]>(() => {
    if (!searchQuery) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allRooms.filter(
      (room) =>
        room.name.toLowerCase().includes(lowerCaseQuery) ||
        room.id.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, allRooms]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length === 1) {
      const room = searchResults[0];
      setSelectedFloorId(room.floorId);
      setHighlightedRoomId(room.id);
      setSearchQuery('');
    }
  };

  const handleSelectSearchResult = (room: Room) => {
    setSelectedFloorId(room.floorId);
    setHighlightedRoomId(room.id);
    setSearchQuery('');
  };

  const handleRoomClick = useCallback((roomId: string | null) => {
    setHighlightedRoomId(roomId);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground font-body">
      <div className="w-80 flex flex-col border-r bg-card/50">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-headline font-bold text-center">FloorFinder</h1>
        </header>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by room name or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        {searchQuery ? (
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0">
              {searchResults.length > 0 ? (
                <ul className="space-y-2">
                  {searchResults.map((room) => (
                    <li key={room.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto"
                        onClick={() => handleSelectSearchResult(room)}
                      >
                        <div>
                          <p className="font-semibold">{room.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {room.floorId} - {allFloors.find(f => f.id === room.floorId)?.name}
                          </p>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground p-4">No results found.</p>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-headline font-semibold px-4 pb-2">Floors</h2>
            <ScrollArea className="flex-1">
              <nav className="px-4">
                {
                  <ul className="space-y-1">
                    {sortedFloors.map((floor) => (
                      <li key={floor.id}>
                        <Button
                          variant={selectedFloorId === floor.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                              setSelectedFloorId(floor.id);
                              setHighlightedRoomId(null);
                              window.location.hash = `floor${floor.id}`; // Update URL hash
                          }}
                        >
                          {floor.id} - {floor.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                }
              </nav>
            </ScrollArea>
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col bg-background relative overflow-hidden">
        {/* Render FloorPlan only if a floor is selected */}
        {selectedFloorId && (
          <FloorPlan
            floorId={selectedFloorId}
            highlightedRoomId={highlightedRoomId}
            onRoomClick={handleRoomClick}
            rooms={allRooms.filter(r => r.floorId === selectedFloorId)}
          />
        )}
      </main>

      <RoomInfoDialog
        room={selectedRoomForInfo}
        open={!!selectedRoomForInfo}
        onOpenChange={(isOpen) => !isOpen && setSelectedRoomForInfo(null)}
      />
    </div>
  );
}
