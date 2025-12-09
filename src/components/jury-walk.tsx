'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Save, Download, Trash2 } from 'lucide-react';

interface TeamRating {
  teamName: string;
  teamNumber: string;
  projectName: string;
  roomNumber: string;
  tracks: string;
  addonTracks: string;
  concept: number;
  quality: number;
  implementation: number;
  passthroughCameraAPI: number;
  immersiveEntertainment: number;
  handTracking: number;
  notes: string;
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
  'Overall',
  'Judge 1',
  'Judge 2',
  'Judge 3',
  'Judge 4',
  'Judge 5',
  'Judge 6',
  'Judge 7',
  'Judge 8',
  'Judge 9',
  'Judge 10',
  'Judge 11',
  'Judge 12',
  'Judge 13',
  'Judge 14',
  'Judge 15'
];

export const JuryWalk = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [ratings, setRatings] = useState<Record<string, TeamRating>>({});
  const [selectedJuryMember, setSelectedJuryMember] = useState<string>('Overall');
  const [sortField, setSortField] = useState<string>('teamName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [trackFilter, setTrackFilter] = useState<string>('');
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
    if (selectedJuryMember === 'Overall') {
      setRatings({});
    } else if (selectedJuryMember) {
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
        // Extract team number from room name if not already set
        let teamNum = room.teamNumber || '';
        let cleanRoomNumber = room.name || room.id;

        if (!teamNum && room.name) {
          const match = room.name.match(/SF\d+/i);
          if (match) {
            teamNum = match[0].toUpperCase();
          }
        }

        // Remove -SF## pattern from room number
        if (cleanRoomNumber) {
          cleanRoomNumber = cleanRoomNumber.replace(/-SF\d+/i, '').trim();
        }

        acc[key] = {
          teamName: room.teamName,
          teamNumber: teamNum,
          projectName: room.projectName || '',
          roomNumber: cleanRoomNumber,
          floorId: room.floorId
        };
      }
      return acc;
    }, {} as Record<string, { teamName: string; teamNumber: string; projectName: string; roomNumber: string; floorId: string }>);

  const sortedTeams = Object.values(teamsWithRooms).sort((a, b) => {
    const aKey = `${a.teamName}-${a.floorId}`;
    const bKey = `${b.teamName}-${b.floorId}`;
    const aRating = ratings[aKey];
    const bRating = ratings[bKey];

    let aValue: any, bValue: any;

    switch (sortField) {
      case 'teamName':
        aValue = a.teamName;
        bValue = b.teamName;
        break;
      case 'teamNumber':
        // Extract numeric part from team number (SF##) for proper sorting
        const aTeamNum = parseInt(a.teamNumber.replace(/\D/g, '')) || 0;
        const bTeamNum = parseInt(b.teamNumber.replace(/\D/g, '')) || 0;
        aValue = aTeamNum;
        bValue = bTeamNum;
        break;
      case 'projectName':
        aValue = a.projectName;
        bValue = b.projectName;
        break;
      case 'roomNumber':
        // Extract numeric part from room number for proper numeric sorting
        const aNum = parseInt(a.roomNumber.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.roomNumber.replace(/\D/g, '')) || 0;
        aValue = aNum;
        bValue = bNum;
        break;
      case 'tracks':
        aValue = aRating?.tracks || '';
        bValue = bRating?.tracks || '';
        break;
      case 'addonTracks':
        aValue = aRating?.addonTracks || '';
        bValue = bRating?.addonTracks || '';
        break;
      case 'total':
        aValue = aRating?.total || 0;
        bValue = bRating?.total || 0;
        break;
      case 'average':
        aValue = calculateTeamAverage(aKey);
        bValue = calculateTeamAverage(bKey);
        break;
      case 'concept':
      case 'quality':
      case 'implementation':
      case 'passthroughCameraAPI':
      case 'immersiveEntertainment':
      case 'handTracking':
        aValue = aRating?.[sortField as keyof TeamRating] || 0;
        bValue = bRating?.[sortField as keyof TeamRating] || 0;
        break;
      default:
        // Default to floor then team name
        const floorCompare = parseInt(a.floorId) - parseInt(b.floorId);
        if (floorCompare !== 0) return floorCompare;
        return a.teamName.localeCompare(b.teamName);
    }

    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = aValue - bValue;
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  // Check if a scoring field should be disabled based on track selection
  const isTrackFieldDisabled = (teamKey: string, field: string): boolean => {
    const rating = ratings[teamKey];
    if (!rating) return false;

    const tracks = rating.tracks?.toLowerCase() || '';
    const addonTracks = rating.addonTracks?.toLowerCase() || '';

    switch (field) {
      case 'passthroughCameraAPI':
        return !tracks.includes('passthrough camera api') && !addonTracks.includes('passthrough camera api');
      case 'immersiveEntertainment':
        return !tracks.includes('immersive entertainment') && !addonTracks.includes('immersive entertainment');
      case 'handTracking':
        return !tracks.includes('hand tracking') && !addonTracks.includes('hand tracking');
      default:
        return false;
    }
  };

  // Handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (key: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const updateRating = (teamKey: string, field: keyof TeamRating, value: any) => {
    setRatings(prev => {
      const newRatings = { ...prev };
      if (!newRatings[teamKey]) {
        const team = teamsWithRooms[teamKey];
        newRatings[teamKey] = {
          teamName: team.teamName,
          teamNumber: team.teamNumber,
          projectName: team.projectName,
          roomNumber: team.roomNumber,
          tracks: '',
          addonTracks: '',
          concept: 0,
          quality: 0,
          implementation: 0,
          passthroughCameraAPI: 0,
          immersiveEntertainment: 0,
          handTracking: 0,
          notes: '',
          total: 0
        };
      }

      newRatings[teamKey] = {
        ...newRatings[teamKey],
        [field]: value
      };

      // Calculate average (all 6 criteria, max 5 each)
      const r = newRatings[teamKey];
      const scores = [r.concept, r.quality, r.implementation, r.passthroughCameraAPI, r.immersiveEntertainment, r.handTracking];
      const nonZeroScores = scores.filter(score => score > 0);
      r.total = nonZeroScores.length > 0 ? nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length : 0;

      // Auto-save to localStorage immediately
      if (selectedJuryMember && selectedJuryMember !== 'Overall') {
        localStorage.setItem(`juryWalkRatings_${selectedJuryMember}`, JSON.stringify(newRatings));
      }

      return newRatings;
    });
  };

  // Calculate average across all judges for a team
  const calculateTeamAverage = (teamKey: string): number => {
    const allJudgeRatings = JURY_MEMBERS
      .filter(judge => judge !== 'Overall')
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

  // Calculate average for a specific field across all judges
  const calculateFieldAverage = (teamKey: string, field: keyof TeamRating): number => {
    if (typeof field === 'string' && ['concept', 'quality', 'implementation', 'passthroughCameraAPI', 'immersiveEntertainment', 'handTracking'].includes(field)) {
      const allJudgeScores = JURY_MEMBERS
        .filter(judge => judge !== 'Overall')
        .map(judge => {
          const savedRatings = localStorage.getItem(`juryWalkRatings_${judge}`);
          if (savedRatings) {
            const judgeRatings = JSON.parse(savedRatings);
            const rating = judgeRatings[teamKey];
            return rating?.[field] || 0;
          }
          return 0;
        })
        .filter(score => score > 0); // Only count rated entries

      if (allJudgeScores.length === 0) return 0;
      return allJudgeScores.reduce((sum, score) => sum + score, 0) / allJudgeScores.length;
    }
    return 0;
  };

  // Get most common track selection across all judges
  const getMostCommonTrack = (teamKey: string, field: 'tracks' | 'addonTracks'): string => {
    const trackCounts: Record<string, number> = {};

    JURY_MEMBERS
      .filter(judge => judge !== 'Overall')
      .forEach(judge => {
        const savedRatings = localStorage.getItem(`juryWalkRatings_${judge}`);
        if (savedRatings) {
          const judgeRatings = JSON.parse(savedRatings);
          const track = judgeRatings[teamKey]?.[field];
          if (track && track !== '') {
            trackCounts[track] = (trackCounts[track] || 0) + 1;
          }
        }
      });

    // Return the most common track, or empty string if no tracks selected
    let mostCommon = '';
    let maxCount = 0;
    for (const [track, count] of Object.entries(trackCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = track;
      }
    }
    return mostCommon;
  };

  // Get all notes from all judges for overall view
  const getAllNotes = (teamKey: string): Array<{ judge: string; notes: string }> => {
    const allNotes: Array<{ judge: string; notes: string }> = [];

    JURY_MEMBERS
      .filter(judge => judge !== 'Overall')
      .forEach(judge => {
        const savedRatings = localStorage.getItem(`juryWalkRatings_${judge}`);
        if (savedRatings) {
          const judgeRatings = JSON.parse(savedRatings);
          const notes = judgeRatings[teamKey]?.notes;
          if (notes && notes.trim() !== '') {
            allNotes.push({ judge, notes: notes.trim() });
          }
        }
      });

    return allNotes;
  };

  const saveRatings = () => {
    if (!selectedJuryMember || selectedJuryMember === 'Overall') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot save in Overall view. Please select a specific jury member.",
      });
      return;
    }
    localStorage.setItem(`juryWalkRatings_${selectedJuryMember}`, JSON.stringify(ratings));
    toast({
      title: "Manual save completed",
      description: `Ratings manually saved for ${selectedJuryMember}. (Auto-save is enabled)`,
    });
  };

  const clearRatings = () => {
    if (!selectedJuryMember || selectedJuryMember === 'Overall') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot clear ratings in Overall view. Please select a specific jury member.",
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
    if (!selectedJuryMember) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a view first.",
      });
      return;
    }

    const headers = ['Team', 'Room', 'Team #', 'Project', 'Tracks', 'Add-on Tracks', 'Concept', 'Quality', 'Implementation', 'Passthrough Camera API', 'Immersive Entertainment', 'Hand Tracking', 'Average', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...sortedTeams.map(team => {
        const key = `${team.teamName}-${team.floorId}`;

        if (selectedJuryMember === 'Overall') {
          // Export aggregate data for Overall view
          const allNotes = getAllNotes(key);
          const aggregatedNotes = allNotes
            .map(note => `${note.judge}: ${note.notes}`)
            .join(' | ');

          return [
            `"${team.teamName}"`,
            team.roomNumber,
            `"${team.teamNumber}"`,
            `"${team.projectName}"`,
            `"${getMostCommonTrack(key, 'tracks')}"`,
            `"${getMostCommonTrack(key, 'addonTracks')}"`,
            calculateFieldAverage(key, 'concept').toFixed(1),
            calculateFieldAverage(key, 'quality').toFixed(1),
            calculateFieldAverage(key, 'implementation').toFixed(1),
            calculateFieldAverage(key, 'passthroughCameraAPI').toFixed(1),
            calculateFieldAverage(key, 'immersiveEntertainment').toFixed(1),
            calculateFieldAverage(key, 'handTracking').toFixed(1),
            calculateTeamAverage(key).toFixed(1),
            `"${aggregatedNotes}"`
          ].join(',');
        } else {
          // Export individual judge data
          const r = ratings[key];
          if (!r) return null;
          return [
            `"${r.teamName}"`,
            r.roomNumber,
            `"${r.teamNumber}"`,
            `"${r.projectName}"`,
            `"${r.tracks}"`,
            `"${r.addonTracks}"`,
            r.concept,
            r.quality,
            r.implementation,
            r.passthroughCameraAPI,
            r.immersiveEntertainment,
            r.handTracking,
            r.total.toFixed(1),
            `"${r.notes}"`
          ].join(',');
        }
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
            <div className="text-sm font-medium">
              {selectedJuryMember === 'Overall' ? (
                <span className="text-blue-600 dark:text-blue-400">📊 Read-only aggregate view</span>
              ) : (
                <span className="text-green-600 dark:text-green-400">✓ Auto-save enabled</span>
              )}
            </div>
            <ThemeToggle />
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

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Teams Rated</h3>
            <p className="text-2xl font-bold text-primary">
              {selectedJuryMember === 'Overall'
                ? Object.values(teamsWithRooms).filter(team => {
                    const key = `${team.teamName}-${team.floorId}`;
                    return calculateTeamAverage(key) > 0;
                  }).length
                : Object.keys(ratings).filter(k => ratings[k].total > 0).length
              } / {sortedTeams.length}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-primary">
              {selectedJuryMember === 'Overall' ? (() => {
                const averages = Object.values(teamsWithRooms).map(team => {
                  const key = `${team.teamName}-${team.floorId}`;
                  return calculateTeamAverage(key);
                }).filter(avg => avg > 0);
                return averages.length > 0
                  ? (averages.reduce((sum, avg) => sum + avg, 0) / averages.length).toFixed(1)
                  : '0.0';
              })() : (
                Object.values(ratings).length > 0
                  ? (Object.values(ratings).reduce((sum, r) => sum + r.total, 0) / Object.values(ratings).filter(r => r.total > 0).length || 0).toFixed(1)
                  : '0.0'
              )} / 5
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Top Score</h3>
            <p className="text-2xl font-bold text-primary">
              {selectedJuryMember === 'Overall' ? (() => {
                const averages = Object.values(teamsWithRooms).map(team => {
                  const key = `${team.teamName}-${team.floorId}`;
                  return calculateTeamAverage(key);
                });
                return averages.length > 0
                  ? Math.max(...averages, 0).toFixed(1)
                  : '0.0';
              })() : (
                Object.values(ratings).length > 0
                  ? Math.max(...Object.values(ratings).map(r => r.total), 0).toFixed(1)
                  : '0.0'
              )} / 5
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Select ratings from dropdown menus: 1-5 points (- = not rated)</li>
            <li>• Average score is automatically calculated from rated fields (max 5 points)</li>
            <li>• Only fields with scores greater than 0 contribute to the average</li>
            <li>• Ratings are automatically saved as you make changes</li>
            <li>• Export to CSV to download all ratings for external analysis</li>
            <li>• Use Clear All to reset all ratings (this cannot be undone)</li>
          </ul>
        </div>

        {/* Rating Cards */}
        <div className="bg-card rounded-lg shadow-lg">
          {!selectedJuryMember ? (
            <div className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Please select a view.</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {/* Filter and sorting options */}
              <div className="mb-4 space-y-3">
                {/* Track Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter by track:</span>
                  <select
                    value={trackFilter}
                    onChange={(e) => setTrackFilter(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background text-sm"
                  >
                    <option value="">All Tracks</option>
                    {TRACK_OPTIONS.filter(t => t).map(track => (
                      <option key={track} value={track}>{track}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting options */}
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-muted-foreground">Sort by:</span>
                  <button
                    onClick={() => handleSort('teamNumber')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'teamNumber' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Team # {sortField === 'teamNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('teamName')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'teamName' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Team {sortField === 'teamName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('projectName')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'projectName' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Project {sortField === 'projectName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('roomNumber')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'roomNumber' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Room {sortField === 'roomNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('total')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'total' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Average {sortField === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>

              {sortedTeams
                .filter(team => {
                  if (!trackFilter) return true;
                  const key = `${team.teamName}-${team.floorId}`;

                  // For Overall view, check aggregate tracks
                  if (selectedJuryMember === 'Overall') {
                    const mostCommonTrack = getMostCommonTrack(key, 'tracks');
                    const mostCommonAddonTrack = getMostCommonTrack(key, 'addonTracks');
                    return mostCommonTrack === trackFilter || mostCommonAddonTrack === trackFilter;
                  }

                  // For individual judge view, check their ratings
                  const rating = ratings[key];
                  if (!rating) return false;
                  return rating.tracks === trackFilter || rating.addonTracks === trackFilter;
                })
                .map((team, index) => {
                const key = `${team.teamName}-${team.floorId}`;
                let rating: TeamRating;

                if (selectedJuryMember === 'Overall') {
                  // Show aggregate data for Overall view
                  const allNotes = getAllNotes(key);
                  const aggregatedNotes = allNotes
                    .map(note => `${note.judge}: ${note.notes}`)
                    .join(' | ');

                  rating = {
                    teamName: team.teamName,
                    teamNumber: team.teamNumber,
                    projectName: team.projectName,
                    roomNumber: team.roomNumber,
                    tracks: getMostCommonTrack(key, 'tracks'),
                    addonTracks: getMostCommonTrack(key, 'addonTracks'),
                    concept: calculateFieldAverage(key, 'concept'),
                    quality: calculateFieldAverage(key, 'quality'),
                    implementation: calculateFieldAverage(key, 'implementation'),
                    passthroughCameraAPI: calculateFieldAverage(key, 'passthroughCameraAPI'),
                    immersiveEntertainment: calculateFieldAverage(key, 'immersiveEntertainment'),
                    handTracking: calculateFieldAverage(key, 'handTracking'),
                    notes: aggregatedNotes,
                    total: calculateTeamAverage(key)
                  };
                } else {
                  // Show individual judge data
                  rating = ratings[key] || {
                    teamName: team.teamName,
                    teamNumber: team.teamNumber,
                    projectName: team.projectName,
                    roomNumber: team.roomNumber,
                    tracks: '',
                    addonTracks: '',
                    concept: 0,
                    quality: 0,
                    implementation: 0,
                    passthroughCameraAPI: 0,
                    immersiveEntertainment: 0,
                    handTracking: 0,
                    notes: '',
                    total: 0
                  };
                }
                const isExpanded = expandedRows.has(key);

                return (
                  <div key={key} className="border rounded-lg bg-background hover:bg-muted/20 transition-colors">
                    {/* Collapsed row - always visible */}
                    <div
                      className="p-4 cursor-pointer select-none"
                      onClick={() => toggleRowExpansion(key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-1">
                            <div className="grid grid-cols-[1fr,auto,auto,1fr] gap-3 items-center">
                              <span className="font-medium text-sm lg:text-base truncate">{team.teamName}</span>
                              <span className="text-sm lg:text-base text-muted-foreground whitespace-nowrap">Room {team.roomNumber}</span>
                              {team.teamNumber ? (
                                <span className="font-bold text-sm lg:text-base text-purple-600 dark:text-purple-400 whitespace-nowrap">{team.teamNumber}</span>
                              ) : (
                                <span></span>
                              )}
                              {team.projectName && (
                                <span className="text-xs lg:text-sm text-blue-600 dark:text-blue-400 truncate ml-2">{team.projectName}</span>
                              )}
                            </div>
                          </div>
                          {(rating.tracks || rating.addonTracks) && (
                            <div className="flex gap-1">
                              {rating.tracks && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-sm text-xs">
                                  {rating.tracks}
                                </span>
                              )}
                              {rating.addonTracks && (
                                <span className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground rounded-sm text-xs">
                                  +{rating.addonTracks}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {rating.total > 0 ? rating.total.toFixed(1) : '-'} / 5
                            </div>
                          </div>
                          <div className="text-lg">
                            {isExpanded ? '−' : '+'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded scoring section */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t bg-muted/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Track Selection */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Track Selection</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Primary Track</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm">
                                    {rating.tracks || 'No consensus'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.tracks}
                                    onChange={(e) => updateRating(key, 'tracks', e.target.value)}
                                    className="w-full px-3 py-2 border rounded bg-background text-sm"
                                  >
                                    {TRACK_OPTIONS.map(option => (
                                      <option key={option} value={option}>
                                        {option || 'Select...'}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Add-on Track</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm">
                                    {rating.addonTracks || 'No consensus'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.addonTracks}
                                    onChange={(e) => updateRating(key, 'addonTracks', e.target.value)}
                                    className="w-full px-3 py-2 border rounded bg-background text-sm"
                                  >
                                    {TRACK_OPTIONS.map(option => (
                                      <option key={`addon-${option}`} value={option}>
                                        {option || 'Select...'}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Scoring Grid */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">
                              {selectedJuryMember === 'Overall' ? 'Average Scores (All Judges)' : 'Scores (1-5)'}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Concept</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.concept > 0 ? rating.concept.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.concept}
                                    onChange={(e) => updateRating(key, 'concept', parseInt(e.target.value))}
                                    className="w-full px-2 py-2 border rounded bg-background text-center text-sm"
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`concept-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Quality</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.quality > 0 ? rating.quality.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.quality}
                                    onChange={(e) => updateRating(key, 'quality', parseInt(e.target.value))}
                                    className="w-full px-2 py-2 border rounded bg-background text-center text-sm"
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`quality-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Implementation</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.implementation > 0 ? rating.implementation.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.implementation}
                                    onChange={(e) => updateRating(key, 'implementation', parseInt(e.target.value))}
                                    className="w-full px-2 py-2 border rounded bg-background text-center text-sm"
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`implementation-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Passthrough API</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.passthroughCameraAPI > 0 ? rating.passthroughCameraAPI.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.passthroughCameraAPI}
                                    onChange={(e) => updateRating(key, 'passthroughCameraAPI', parseInt(e.target.value))}
                                    disabled={isTrackFieldDisabled(key, 'passthroughCameraAPI')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(key, 'passthroughCameraAPI') ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`passthrough-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Immersive Ent.</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.immersiveEntertainment > 0 ? rating.immersiveEntertainment.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.immersiveEntertainment}
                                    onChange={(e) => updateRating(key, 'immersiveEntertainment', parseInt(e.target.value))}
                                    disabled={isTrackFieldDisabled(key, 'immersiveEntertainment')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(key, 'immersiveEntertainment') ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`immersive-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Hand Tracking</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.handTracking > 0 ? rating.handTracking.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.handTracking}
                                    onChange={(e) => updateRating(key, 'handTracking', parseInt(e.target.value))}
                                    disabled={isTrackFieldDisabled(key, 'handTracking')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(key, 'handTracking') ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`handtracking-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">
                            {selectedJuryMember === 'Overall' ? 'All Judge Notes' : 'Notes'}
                          </h4>
                          {selectedJuryMember === 'Overall' ? (
                            <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm min-h-[60px]">
                              {rating.notes ? (
                                <div className="space-y-2">
                                  {getAllNotes(key).map((note, idx) => (
                                    <div key={idx} className="border-b border-muted pb-1 last:border-b-0">
                                      <span className="font-medium text-primary">{note.judge}:</span> {note.notes}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                'No notes from any judges yet'
                              )}
                            </div>
                          ) : (
                            <textarea
                              value={rating.notes}
                              onChange={(e) => updateRating(key, 'notes', e.target.value)}
                              placeholder="Add notes about this team..."
                              className="w-full px-3 py-2 border rounded bg-background text-sm min-h-[60px] resize-y"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};