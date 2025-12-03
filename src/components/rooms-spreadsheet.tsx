'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Room, Floor } from '@/lib/types';
import { allFloors } from '@/lib/config';

interface RoomsSpreadsheetProps {
  rooms: Room[];
  customFloorNames: Record<string, string>;
}

export function RoomsSpreadsheet({ rooms, customFloorNames }: RoomsSpreadsheetProps) {
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

    const csvData = sortedRooms.map(room => [
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

  const sortedRooms = useMemo(() => {
    return roomsWithFloorData.sort((a, b) => {
      // Sort by floor level first, then by room name
      if (a.floorLevel !== b.floorLevel) {
        return a.floorLevel - b.floorLevel;
      }
      return a.name.localeCompare(b.name);
    });
  }, [roomsWithFloorData]);

  const totalRooms = rooms.length;
  const totalArea = roomsWithFloorData.reduce((sum, room) => sum + parseFloat(room.area), 0);
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
          <h3 className="font-semibold text-lg">Total Area</h3>
          <p className="text-2xl font-bold text-primary">{totalArea.toFixed(1)} sq units</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-lg">Average Room Size</h3>
          <p className="text-2xl font-bold text-primary">{totalRooms > 0 ? (totalArea / totalRooms).toFixed(1) : '0'} sq units</p>
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
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">All Rooms</h3>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
              {sortedRooms.map((room) => (
                <TableRow key={room.id}>
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
              {sortedRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No rooms found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}