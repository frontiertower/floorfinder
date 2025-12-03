'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search, Upload } from 'lucide-react';
import type { Room, Floor } from '@/lib/types';
import { allFloors } from '@/lib/config';
import { RoomOptionsDialog } from './room-options-dialog';

interface RoomsSpreadsheetProps {
  rooms: Room[];
  customFloorNames: Record<string, string>;
  isEditMode?: boolean;
  onRoomUpdate?: (room: Room) => void;
  onRoomDelete?: (roomId: string) => void;
  onRoomsImport?: (rooms: Room[]) => void;
}

export function RoomsSpreadsheet({ rooms, customFloorNames, isEditMode = false, onRoomUpdate, onRoomDelete, onRoomsImport }: RoomsSpreadsheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);

  const roomsWithFloorData = useMemo(() => {
    return rooms.map(room => {
      const floor = allFloors.find(f => f.id === room.floorId?.replace('floor-', ''));
      const floorName = customFloorNames[room.floorId || ''] || floor?.name || 'Unknown';

      // Calculate room size (area) from coordinates
      const [x, y, width, height] = room.coords;
      const area = width * height;

      return {
        ...room,
        floorName,
        floorLevel: floor?.level || 0,
        area: area.toFixed(1),
        dimensions: `${width.toFixed(1)} × ${height.toFixed(1)}`
      };
    });
  }, [rooms, customFloorNames]);

  const importCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const lines = text.split('\n');

      // Skip header row
      const dataLines = lines.slice(1).filter(line => line.trim());

      const importedRooms: Room[] = [];

      dataLines.forEach(line => {
        // Parse CSV line (handle quoted values)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 9) return;

        // Clean up values (remove quotes)
        const values = matches.map(val => val.replace(/^"|"$/g, ''));

        // Parse coordinates array
        let coords: [number, number, number, number];
        try {
          const coordsStr = values[8].replace(/^\[|\]$/g, '');
          const coordsArr = coordsStr.split(',').map(c => parseFloat(c.trim()));
          if (coordsArr.length !== 4) return;
          coords = coordsArr as [number, number, number, number];
        } catch {
          return;
        }

        // Find floor ID from floor name
        let floorId = '';
        for (const floor of allFloors) {
          const floorName = customFloorNames[floor.id] || floor.name;
          if (floorName === values[3]) {
            floorId = floor.id;
            break;
          }
        }

        if (!floorId) return;

        const room: Room = {
          id: values[0],
          name: values[1] || 'Unnamed Room',
          teamName: values[2] || undefined,
          floorId,
          color: values[6] || 'rgba(76, 175, 80, 0.5)',
          notes: values[7] || undefined,
          coords
        };

        importedRooms.push(room);
      });

      if (importedRooms.length > 0 && onRoomsImport) {
        onRoomsImport(importedRooms);
      }
    };

    input.click();
  };

  const exportToCSV = () => {
    const headers = [
      'Room ID',
      'Name',
      'Team Name',
      'Floor',
      'Dimensions',
      'Area',
      'Color',
      'Notes',
      'Coordinates'
    ];

    const csvData = filteredAndSortedRooms.map(room => [
      room.id,
      room.name,
      room.teamName || '',
      room.floorName,
      room.dimensions,
      room.area,
      room.color,
      room.notes || '',
      `"[${room.coords.map(c => c.toFixed(1)).join(', ')}]"`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rooms_data.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = roomsWithFloorData;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = roomsWithFloorData.filter(room =>
        room.name.toLowerCase().includes(query) ||
        room.id.toLowerCase().includes(query) ||
        (room.teamName && room.teamName.toLowerCase().includes(query)) ||
        (room.notes && room.notes.toLowerCase().includes(query)) ||
        room.floorName.toLowerCase().includes(query)
      );
    }

    // Sort by floor level first, then by room name
    return filtered.sort((a, b) => {
      if (a.floorLevel !== b.floorLevel) {
        return a.floorLevel - b.floorLevel;
      }
      return a.name.localeCompare(b.name);
    });
  }, [roomsWithFloorData, searchQuery]);

  const handleRoomClick = (room: Room) => {
    if (isEditMode) {
      setSelectedRoom(room);
      setShowOptionsDialog(true);
    }
  };

  const handleRoomUpdate = (updatedRoom: Room) => {
    if (onRoomUpdate) {
      onRoomUpdate(updatedRoom);
    }
    setSelectedRoom(null);
    setShowOptionsDialog(false);
  };

  const handleRoomDelete = () => {
    if (selectedRoom && onRoomDelete) {
      onRoomDelete(selectedRoom.id);
    }
    setSelectedRoom(null);
    setShowOptionsDialog(false);
  };

  const totalRooms = rooms.length;
  const totalTeams = roomsWithFloorData.filter(room => room.teamName && room.teamName.trim()).length;
  const floorCounts = roomsWithFloorData.reduce((acc, room) => {
    acc[room.floorName] = (acc[room.floorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-lg">Total Rooms</h3>
          <p className="text-2xl font-bold text-primary">{totalRooms}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-lg">Total Teams</h3>
          <p className="text-2xl font-bold text-primary">{totalTeams}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-lg">Rooms with Teams</h3>
          <p className="text-2xl font-bold text-primary">{totalRooms > 0 ? Math.round((totalTeams / totalRooms) * 100) : 0}%</p>
        </div>
      </div>

      {/* Rooms by Floor */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold text-lg mb-3">Rooms by Floor</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(floorCounts).map(([floorName, count]) => (
            <div key={floorName} className="text-sm">
              <span className="font-medium">{floorName}:</span> {count}
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">All Rooms</h3>
              {isEditMode && (
                <p className="text-sm text-muted-foreground">Click any row to edit room details</p>
              )}
            </div>
            <div className="flex gap-2">
              {isEditMode && onRoomsImport && (
                <Button onClick={importCSV} variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              )}
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms, teams, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedRooms.length} of {totalRooms} rooms
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Coordinates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRooms.map((room) => (
                <TableRow
                  key={room.id}
                  className={isEditMode ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => handleRoomClick(room)}
                >
                  <TableCell className="font-mono text-sm">{room.id}</TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.teamName || '-'}</TableCell>
                  <TableCell>{room.floorName}</TableCell>
                  <TableCell className="font-mono text-sm">{room.dimensions}</TableCell>
                  <TableCell className="font-mono text-sm">{room.area}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border border-gray-300 rounded"
                        style={{ backgroundColor: room.color }}
                        title={room.color}
                      />
                      <span className="text-xs text-muted-foreground">{room.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={room.notes}>
                    {room.notes || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    [{room.coords.map(c => c.toFixed(1)).join(', ')}]
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    {searchQuery ? 'No rooms found matching your search' : 'No rooms found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Room Options Dialog for Edit Mode */}
      <RoomOptionsDialog
        isOpen={showOptionsDialog}
        onClose={() => {
          setShowOptionsDialog(false);
          setSelectedRoom(null);
        }}
        onSave={handleRoomUpdate}
        onDelete={handleRoomDelete}
        room={selectedRoom}
      />
    </div>
  );
}