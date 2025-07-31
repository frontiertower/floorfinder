
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Floor, Room, FloorData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Info } from 'lucide-react';

import FloorPlan from './floor-plan';
import RoomInfoDialog from './room-info-dialog';

export default function FloorFinder() {
  const [floorData, setFloorData] = useState<FloorData>({ floors: [], rooms: [] });
  const [loading, setLoading] = useState(true);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('1');
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomForInfo, setSelectedRoomForInfo] = useState<Room | null>(null);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((data) => {
        setFloorData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const sortedFloors = useMemo(() => {
    return [...floorData.floors].sort((a, b) => b.level - a.level);
  }, [floorData.floors]);

  const searchResults = useMemo<Room[]>(() => {
    if (!searchQuery) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return floorData.rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(lowerCaseQuery) ||
        room.id.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, floorData.rooms]);

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
                            ID: {room.id} &middot; Floor: {floorData.floors.find(f => f.id === room.floorId)?.name}
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
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {sortedFloors.map((floor) => (
                      <li key={floor.id}>
                        <Button
                          variant={selectedFloorId === floor.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                              setSelectedFloorId(floor.id)
                              setHighlightedRoomId(null)
                          }}
                        >
                          {floor.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </ScrollArea>
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <FloorPlan
          floorId={selectedFloorId}
          highlightedRoomId={highlightedRoomId}
          onRoomClick={handleRoomClick}
          rooms={floorData.rooms.filter(r => r.floorId === selectedFloorId)}
        />
      </main>

      <RoomInfoDialog
        room={selectedRoomForInfo}
        open={!!selectedRoomForInfo}
        onOpenChange={(isOpen) => !isOpen && setSelectedRoomForInfo(null)}
      />
    </div>
  );
}
