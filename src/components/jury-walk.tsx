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
  immersiveEntertainment: number;
  handTracking: number;
  total: number;
}

const TRACK_OPTIONS = [
  '',
  'MR/VR',
  'Passthrough Camera API',
  'Immersive Entertainment',
  'Hand Tracking',
  'Project Upgrade'
];

const SCORE_OPTIONS = [
  { value: 0, label: '-' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' }
];

const JURY_MEMBERS = [
  'Select Jury Member',
  'Judge 1',
  'Judge 2',
  'Judge 3',
  'Judge 4',
  'Judge 5',
  'Judge 6',
  'Judge 7',
  'Judge 8'
];

export const JuryWalk = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [ratings, setRatings] = useState<Record<string, TeamRating>>({});
  const [selectedJuryMember, setSelectedJuryMember] = useState<string>('');
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

  // Load saved ratings from localStorage for selected jury member
  useEffect(() => {
    if (selectedJuryMember && selectedJuryMember !== 'Select Jury Member') {
      const savedRatings = localStorage.getItem(`juryWalkRatings_${selectedJuryMember}`);
      if (savedRatings) {
        setRatings(JSON.parse(savedRatings));
      } else {
        setRatings({});
      }
    } else {
      setRatings({});
    }
  }, [selectedJuryMember]);

  // Get unique teams with their room names
  const teamsWithRooms = allRooms
    .filter(room => room.teamName && room.teamName !== 'Private')
    .reduce((acc, room) => {
      const key = `${room.teamName}-${room.floorId}`;
      if (!acc[key]) {
        acc[key] = {
          teamName: room.teamName,
          roomNumber: room.name || room.id, // Use room name if available, otherwise ID
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
          immersiveEntertainment: 0,
          handTracking: 0,
          total: 0
        };
      }

      newRatings[teamKey] = {
        ...newRatings[teamKey],
        [field]: value
      };

      // Calculate total (all 6 criteria, max 5 each = 30 total)
      const r = newRatings[teamKey];
      r.total = r.concept + r.quality + r.implementation + r.passthroughCameraAPI + r.immersiveEntertainment + r.handTracking;

      return newRatings;
    });
  };

  // Calculate average across all judges for a team
  const calculateTeamAverage = (teamKey: string): number => {
    const allJudgeRatings = JURY_MEMBERS
      .filter(judge => judge !== 'Select Jury Member')
      .map(judge => {
        const savedRatings = localStorage.getItem(`juryWalkRatings_${judge}`);
        if (savedRatings) {
          const judgeRatings = JSON.parse(savedRatings);
          return judgeRatings[teamKey]?.total || 0;
        }
        return 0;
      })
      .filter(total => total > 0); // Only count rated entries

    if (allJudgeRatings.length === 0) return 0;
    return allJudgeRatings.reduce((sum, total) => sum + total, 0) / allJudgeRatings.length;
  };

  const saveRatings = () => {
    if (!selectedJuryMember || selectedJuryMember === 'Select Jury Member') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a jury member first.",
      });
      return;
    }
    localStorage.setItem(`juryWalkRatings_${selectedJuryMember}`, JSON.stringify(ratings));
    toast({
      title: "Ratings saved",
      description: `Ratings saved for ${selectedJuryMember}.`,
    });
  };

  const clearRatings = () => {
    if (!selectedJuryMember || selectedJuryMember === 'Select Jury Member') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a jury member first.",
      });
      return;
    }
    if (confirm(`Are you sure you want to clear all ratings for ${selectedJuryMember}?`)) {
      setRatings({});
      localStorage.removeItem(`juryWalkRatings_${selectedJuryMember}`);
      toast({
        title: "Ratings cleared",
        description: `All ratings for ${selectedJuryMember} have been removed.`,
      });
    }
  };

  const exportToCSV = () => {
    if (!selectedJuryMember || selectedJuryMember === 'Select Jury Member') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a jury member first.",
      });
      return;
    }

    const headers = ['Team', 'Room', 'Tracks', 'Add-on Tracks', 'Concept', 'Quality', 'Implementation', 'Passthrough Camera API', 'Immersive Entertainment', 'Hand Tracking', 'Total', 'Average (All Judges)'];
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
          r.immersiveEntertainment,
          r.handTracking,
          r.total,
          calculateTeamAverage(key).toFixed(1)
        ].join(',');
      }).filter(Boolean)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jury-walk-ratings-${selectedJuryMember.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Ratings for ${selectedJuryMember} exported to CSV file.`,
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

            {/* Jury Member Selection */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">Select Jury Member:</label>
              <select
                value={selectedJuryMember}
                onChange={(e) => setSelectedJuryMember(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground border-border min-w-[200px]"
              >
                {JURY_MEMBERS.map(member => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
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
          {!selectedJuryMember || selectedJuryMember === 'Select Jury Member' ? (
            <div className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Please select a jury member to begin rating teams.</p>
            </div>
          ) : (
          <table className="w-full min-w-[1300px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Team</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Room</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Tracks</th>
                <th className="p-2 text-left font-semibold text-xs lg:text-sm">Add-on Tracks</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Concept<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Quality<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Implementation<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Passthrough<br/>Camera API<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Immersive<br/>Entertainment<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm">Hand<br/>Tracking<br/>(1-5)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm bg-primary/10">Total<br/>(0-30)</th>
                <th className="p-2 text-center font-semibold text-xs lg:text-sm bg-green-100 dark:bg-green-900">Average<br/>(All Judges)</th>
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
                      <select
                        value={rating.tracks}
                        onChange={(e) => updateRating(key, 'tracks', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-background text-xs lg:text-sm"
                      >
                        {TRACK_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option || 'Select...'}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={rating.addonTracks}
                        onChange={(e) => updateRating(key, 'addonTracks', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-background text-xs lg:text-sm"
                      >
                        {TRACK_OPTIONS.map(option => (
                          <option key={`addon-${option}`} value={option}>
                            {option || 'Select...'}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.concept}
                        onChange={(e) => updateRating(key, 'concept', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`concept-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.quality}
                        onChange={(e) => updateRating(key, 'quality', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`quality-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.implementation}
                        onChange={(e) => updateRating(key, 'implementation', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`implementation-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.passthroughCameraAPI}
                        onChange={(e) => updateRating(key, 'passthroughCameraAPI', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`passthrough-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.immersiveEntertainment}
                        onChange={(e) => updateRating(key, 'immersiveEntertainment', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`immersive-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={rating.handTracking}
                        onChange={(e) => updateRating(key, 'handTracking', parseInt(e.target.value))}
                        className="w-16 px-1 py-1 border rounded bg-background text-center text-xs lg:text-sm"
                      >
                        {SCORE_OPTIONS.map(option => (
                          <option key={`handtracking-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center bg-primary/10 font-bold text-sm lg:text-base">
                      {rating.total}
                    </td>
                    <td className="p-2 text-center bg-green-100 dark:bg-green-900 font-bold text-sm lg:text-base">
                      {calculateTeamAverage(key).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
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
                : '0.0'} / 30
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Top Score</h3>
            <p className="text-2xl font-bold text-primary">
              {Object.values(ratings).length > 0
                ? Math.max(...Object.values(ratings).map(r => r.total), 0)
                : 0} / 30
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Select ratings from dropdown menus: 1-5 points (- = not rated)</li>
            <li>• Total score is automatically calculated (max 30 points)</li>
            <li>• All six rating fields contribute to the total score</li>
            <li>• Ratings are saved locally in your browser - click Save to persist changes</li>
            <li>• Export to CSV to download all ratings for external analysis</li>
            <li>• Use Clear All to reset all ratings (this cannot be undone)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};