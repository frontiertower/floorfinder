
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allFloors } from '@/lib/config';
import type { Room, Floor } from '@/lib/types';
import { Search, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

import FloorPlan from './floor-plan';
import FloorPlanEditable from './floor-plan-editable';
import { FloorNameEditor } from './floor-name-editor';
import { Readme } from './readme';

const FloorFinder = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Map<string, Room[]>>(new Map());
  const [highlightedRoom, setHighlightedRoom] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customFloorNames, setCustomFloorNames] = useState<Record<string, string>>({});

  const { toast } = useToast();

  // Fetch custom floor names on initial load
  useEffect(() => {
    const fetchFloorNames = async () => {
      try {
        const response = await fetch('/api/floors');
        if (response.ok) {
          const floors = await response.json();
          const names: Record<string, string> = {};
          floors.forEach((floor: Floor) => {
            names[floor.id] = floor.name;
          });
          setCustomFloorNames(names);
        }
      } catch (error) {
        console.error('Failed to fetch floor names', error);
      }
    };
    fetchFloorNames();
  }, []);

  // Fetch all rooms from the API on initial load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms.json');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();
        setAllRooms(rooms);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading room data",
          description: "There was a problem fetching room information. Please try again later.",
        });
        console.error(error);
      }
    };
    fetchRooms();
  }, [toast]);

  const getRoomsForFloor = useCallback((floorId: string) => {
    return allRooms.filter(room => room.floorId === floorId);
  }, [allRooms]);

  // Handle room search
  useEffect(() => {
    if (searchQuery.length > 0 && allRooms.length > 0) {
      const results = new Map<string, Room[]>();
      for (const floor of allFloors) {
        const floorRooms = getRoomsForFloor(floor.id);
        const floorResults = floorRooms.filter(room =>
          (room.name && room.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          room.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (floorResults.length > 0) {
          results.set(floor.id, floorResults);
        }
      }
      setSearchResults(results);
    } else {
      setSearchResults(new Map());
      setHighlightedRoom(null);
    }
  }, [searchQuery, allRooms, getRoomsForFloor]);

  // Auto-select and highlight room if only one search result
  useEffect(() => {
    if (searchResults.size === 1) {
      const [floorId, rooms] = searchResults.entries().next().value;
      if (rooms.length === 1) {
        const floor = allFloors.find(f => f.id === floorId);
        if (floor) {
          setSelectedFloor(floor);
        }
        setHighlightedRoom(rooms[0].id);
      }
    }
  }, [searchResults]);

  const handleFloorChange = (floor: Floor) => {
    setSelectedFloor(floor);
    setSearchQuery(''); // Clear search on floor change
    setHighlightedRoom(null); // Clear highlight on floor change
    // Update URL hash with floor ID
    window.location.hash = floor.id;
  };

  // Read hash on initial load or default to readme
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const initialFloor = allFloors.find(f => f.id === hash);
      if (initialFloor) {
        setSelectedFloor(initialFloor);
      } else if (hash === 'readme') {
        setSelectedFloor({ id: 'readme', name: 'App Design Summary', level: 0 }); // Assuming readme has a similar structure to Floor
      }
    } else {
        setSelectedFloor({ id: 'readme', name: 'App Design Summary', level: 0 }); // Default to readme
    }
  }, []);

  const roomsForSelectedFloor = selectedFloor && selectedFloor.id !== 'readme' ? getRoomsForFloor(selectedFloor.id) : [];
  
  // Flatten search results for rendering
  const flatSearchResults = Array.from(searchResults.entries()).flatMap(([floorId, rooms]) => {
      const floor = allFloors.find(f => f.id === floorId);
      return rooms.map(room => ({ ...room, floorName: floor?.name || 'Unknown' }));
  });


  return (
    <div className="flex h-screen bg-card/50">
      {/* Floor Selection Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md flex flex-col bg-card/50">
      <a href="/"><h1 className="text-3xl font-headline text-center mb-4">SensAI Hack</h1></a>
      <a href="/" className="text-center text-blue-500">(<span className="text-blue-500 underline text-center">sensaihack.space</span>)</a>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by room name or ID..."
            className="w-full p-2 pl-8 border rounded mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto">
          {searchQuery ? (
            <div>
              {flatSearchResults.length === 0 ? (
                <p className="text-muted-foreground p-4 text-center">No results found.</p>
              ) : (
                <ul>
                  {flatSearchResults.map(room => (
                    <li key={room.id} className="mb-2">
                      <button
                        className="w-full text-left p-2 rounded hover:bg-gray-100"
                        onClick={() => {
                          const floor = allFloors.find(f => f.id === room.floorId);
                          if (floor) {
                            setSelectedFloor(floor);
                          }
                          setHighlightedRoom(room.id);
                        }}
                      >
                        <div className="font-bold">{room.name} [{room.id}]</div>
                        <div className="text-sm text-muted-foreground">{room.floorName}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-2">Floors</h2>
              <ul className="overflow-y-auto">
                {allFloors.map(floor => (
                  <li key={floor.id} className="mb-1">
                    <button
                      className={`w-full text-left py-2 px-4 rounded transition-colors ${selectedFloor?.id === floor.id ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-primary/20'}`}
                      onClick={() => handleFloorChange(floor)}
                    >
                      {floor.id} - {customFloorNames[floor.id] || floor.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>


      {/* Main Floor Plan View */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header with Floor Name and Edit Button */}
        <div className="flex justify-between items-center px-6 py-4 bg-background border-b">
          <div>
            {selectedFloor && selectedFloor.id !== 'readme' && (
              <FloorNameEditor
                floorId={selectedFloor.id}
                floorName={customFloorNames[selectedFloor.id] || selectedFloor.name}
                isEditMode={isEditMode}
                onNameChange={async (newName) => {
                  try {
                    const response = await fetch('/api/floors', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ floorId: selectedFloor.id, name: newName }),
                    });
                    if (response.ok) {
                      setCustomFloorNames(prev => ({
                        ...prev,
                        [selectedFloor.id]: newName
                      }));
                      toast({
                        title: "Floor renamed",
                        description: `Floor name updated to "${newName}"`,
                      });
                    }
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to update floor name.",
                    });
                  }
                }}
              />
            )}
          </div>
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            size="lg"
          >
            {isEditMode ? (
              <><Save className="mr-2 h-4 w-4" /> Exit Edit Mode</>
            ) : (
              <><Edit className="mr-2 h-4 w-4" /> Edit Mode</>
            )}
          </Button>
          </div>
        </div>

        {/* Floor Plan Content */}
        <div className="flex-1 flex items-center justify-center">
        {selectedFloor ? (
            selectedFloor.id === 'readme' ? (
                <Readme />
            ) : (
                {isEditMode ? (
                  <FloorPlanEditable
                    floorId={selectedFloor.id}
                    highlightedRoomId={highlightedRoom}
                    onRoomClick={(roomId) => {
                        setHighlightedRoom(roomId);
                    }}
                    rooms={roomsForSelectedFloor}
                    isEditMode={isEditMode}
                    onRoomCreated={async (newRoom) => {
                      try {
                        const response = await fetch('/api/rooms.json', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newRoom),
                        });
                        if (response.ok) {
                          // Refresh rooms list
                          const updatedRooms = await response.json();
                          setAllRooms(updatedRooms);
                          toast({
                            title: "Room created",
                            description: "The room has been successfully added.",
                          });
                        } else {
                          throw new Error('Failed to save room');
                        }
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to save the room. Please try again.",
                        });
                      }
                    }}
                  />
                ) : (
                  <FloorPlan
                    floorId={selectedFloor.id}
                    highlightedRoomId={highlightedRoom}
                    onRoomClick={(roomId) => {
                        setHighlightedRoom(roomId);
                    }}
                    rooms={roomsForSelectedFloor}
                  />
                )}
            )
        ) : (
          <p>Select a floor to view the plan.</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default FloorFinder;
