'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Save, Download, Trash2 } from 'lucide-react';

interface TeamRating {
  teamName: string;
  roomNumber: string;
  tracks: string;
  addonTracks: string;
  concept: number;
  quality: number;
  implementation: number;
  passthroughCameraAPI: number;
  immersiveEntertainment: boolean;
  handTracking: boolean;
  total: number;
}

export const JuryWalk = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [ratings, setRatings] = useState<Record<string, TeamRating>>({});
  const { toast } = useToast();

  // Fetch all rooms
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
        console.error('Error loading room data:', error);
      }
    };
    fetchRooms();
  }, []);

  // Load saved ratings from localStorage
  useEffect(() => {
    const savedRatings = localStorage.getItem('juryWalkRatings');
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Get unique teams with their room numbers
  const teamsWithRooms = allRooms
    .filter(room => room.teamName && room.teamName !== 'Private')
    .reduce((acc, room) => {
      const key = `${room.teamName}-${room.floorId}`;
      if (!acc[key]) {
        acc[key] = {
          teamName: room.teamName,
          roomNumber: `${room.id}-${room.floorId}F`,
          floorId: room.floorId
        };
      }
      return acc;
    }, {} as Record<string, { teamName: string; roomNumber: string; floorId: string }>);

  const sortedTeams = Object.values(teamsWithRooms).sort((a, b) => {
    // Sort by floor, then by team name
    const floorCompare = parseInt(a.floorId) - parseInt(b.floorId);
    if (floorCompare !== 0) return floorCompare;
    return a.teamName.localeCompare(b.teamName);
  });

  const updateRating = (teamKey: string, field: keyof TeamRating, value: any) => {
    setRatings(prev => {
      const newRatings = { ...prev };
      if (!newRatings[teamKey]) {
        const team = teamsWithRooms[teamKey];
        newRatings[teamKey] = {
          teamName: team.teamName,
          roomNumber: team.roomNumber,
          tracks: '',
          addonTracks: '',
          concept: 0,
          quality: 0,
          implementation: 0,
          passthroughCameraAPI: 0,
          immersiveEntertainment: false,
          handTracking: false,
          total: 0
        };
      }

      newRatings[teamKey] = {
        ...newRatings[teamKey],
        [field]: value
      };

      // Calculate total
      const r = newRatings[teamKey];
      r.total = r.concept + r.quality + r.implementation + r.passthroughCameraAPI;

      return newRatings;
    });
  };

  const saveRatings = () => {
    localStorage.setItem('juryWalkRatings', JSON.stringify(ratings));
    toast({
      title: "Ratings saved",
      description: "Your ratings have been saved locally.",
    });
  };

  const clearRatings = () => {
    if (confirm('Are you sure you want to clear all ratings?')) {
      setRatings({});
      localStorage.removeItem('juryWalkRatings');
      toast({
        title: "Ratings cleared",
        description: "All ratings have been removed.",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Team Name', 'Room', 'Tracks', 'Add-on Tracks', 'Concept', 'Quality', 'Implementation', 'Passthrough Camera API', 'Total', 'Immersive Entertainment', 'Hand Tracking'];
    const csvContent = [
      headers.join(','),
      ...sortedTeams.map(team => {
        const key = `${team.teamName}-${team.floorId}`;
        const r = ratings[key];
        if (!r) return null;
        return [
          `"${r.teamName}"`,
          r.roomNumber,
          `"${r.tracks}"`,
          `"${r.addonTracks}"`,
          r.concept,
          r.quality,
          r.implementation,
          r.passthroughCameraAPI,
          r.total,
          r.immersiveEntertainment ? 'Yes' : 'No',
          r.handTracking ? 'Yes' : 'No'
        ].join(',');
      }).filter(Boolean)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jury-walk-ratings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Ratings exported to CSV file.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Jury Walk Rating System</h1>
            <p className="text-muted-foreground">Rate teams and track scores for the hackathon</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <ThemeToggle />
            <Button onClick={saveRatings} size="default">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="default">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={clearRatings} variant="destructive" size="default">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block text-center"
            >
              Back to Floors
            </a>
          </div>
        </div>

        {/* Rating Table */}
        <div className="overflow-x-auto bg-card rounded-lg shadow-lg">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Team Name</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Room</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Tracks</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Add-on Tracks</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Concept<br/>(0-10)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Quality<br/>(0-10)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Implementation<br/>(0-10)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Passthrough<br/>Camera API<br/>(0-10)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm bg-primary/10">Total<br/>(0-40)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Immersive<br/>Entertainment</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Hand<br/>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => {
                const key = `${team.teamName}-${team.floorId}`;
                const rating = ratings[key] || {
                  teamName: team.teamName,
                  roomNumber: team.roomNumber,
                  tracks: '',
                  addonTracks: '',
                  concept: 0,
                  quality: 0,
                  implementation: 0,
                  passthroughCameraAPI: 0,
                  immersiveEntertainment: false,
                  handTracking: false,
                  total: 0
                };

                return (
                  <tr key={key} className={`border-b hover:bg-muted/20 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/5'}`}>
                    <td className="p-2 font-medium text-xs lg:text-sm">{team.teamName}</td>
                    <td className="p-2 text-xs lg:text-sm text-muted-foreground">{team.roomNumber}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={rating.tracks}
                        onChange={(e) => updateRating(key, 'tracks', e.target.value)}
                        className="w-24 lg:w-32 px-2 py-1 border rounded bg-background text-xs lg:text-sm"
                        placeholder="Track..."
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={rating.addonTracks}
                        onChange={(e) => updateRating(key, 'addonTracks', e.target.value)}
                        className="w-24 lg:w-32 px-2 py-1 border rounded bg-background text-xs lg:text-sm"
                        placeholder="Add-on..."
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rating.concept}
                        onChange={(e) => updateRating(key, 'concept', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rating.quality}
                        onChange={(e) => updateRating(key, 'quality', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rating.implementation}
                        onChange={(e) => updateRating(key, 'implementation', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rating.passthroughCameraAPI}
                        onChange={(e) => updateRating(key, 'passthroughCameraAPI', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      />
                    </td>
                    <td className="p-2 text-center bg-primary/10 font-bold text-sm lg:text-base">
                      {rating.total}
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={rating.immersiveEntertainment}
                        onChange={(e) => updateRating(key, 'immersiveEntertainment', e.target.checked)}
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={rating.handTracking}
                        onChange={(e) => updateRating(key, 'handTracking', e.target.checked)}
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Teams Rated</h3>
            <p className="text-2xl font-bold text-primary">
              {Object.keys(ratings).filter(k => ratings[k].total > 0).length} / {sortedTeams.length}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-primary">
              {Object.values(ratings).length > 0
                ? (Object.values(ratings).reduce((sum, r) => sum + r.total, 0) / Object.values(ratings).filter(r => r.total > 0).length || 0).toFixed(1)
                : '0.0'} / 40
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Top Score</h3>
            <p className="text-2xl font-bold text-primary">
              {Object.values(ratings).length > 0
                ? Math.max(...Object.values(ratings).map(r => r.total), 0)
                : 0} / 40
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Rate each criterion from 0-10 points</li>
            <li>• Total score is automatically calculated (max 40 points)</li>
            <li>• Check the boxes for teams using Immersive Entertainment or Hand Tracking features</li>
            <li>• Ratings are saved locally in your browser - click Save to persist changes</li>
            <li>• Export to CSV to download all ratings for external analysis</li>
            <li>• Use Clear All to reset all ratings (this cannot be undone)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};