'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/lib/types';
import { TRACK_OPTIONS } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Save, Download, Trash2, Upload } from 'lucide-react';

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
  mrAndVR: number;
  projectUpgrade: number;
  notes: string;
  total: number;
}


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
  'Juror 1',
  'Juror 2',
  'Juror 3',
  'Juror 4',
  'Juror 5',
  'Juror 6',
  'Juror 7',
  'Juror 8',
  'Juror 9',
  'Juror 10',
  'Juror 11',
  'Juror 12',
  'Juror 13',
  'Juror 14',
  'Juror 15'
];

// Track color mapping for consistent visual identification
const TRACK_COLORS: Record<string, string> = {
  'Passthrough Camera API': 'bg-blue-600 text-white',
  'Immersive Entertainment': 'bg-purple-600 text-white',
  'Hand Tracking': 'bg-green-600 text-white',
  'MR and VR': 'bg-orange-600 text-white',
  'Project Upgrade': 'bg-red-600 text-white'
};

const getTrackColor = (track: string): string => {
  return TRACK_COLORS[track] || 'bg-gray-500 text-white';
};

// Check if a team has been judged by current juror
const hasBeenJudged = (rating: TeamRating): boolean => {
  if (!rating) return false;
  // Consider judged if at least one scoring field has a value > 0
  return rating.concept > 0 || rating.quality > 0 || rating.implementation > 0 ||
         rating.passthroughCameraAPI > 0 || rating.immersiveEntertainment > 0 ||
         rating.handTracking > 0 || rating.mrAndVR > 0 || rating.projectUpgrade > 0;
};

export const JuryWalk = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [ratings, setRatings] = useState<Record<string, TeamRating>>({});
  const [allJurorRatings, setAllJurorRatings] = useState<Record<string, Record<string, TeamRating>>>({});
  const [selectedJuryMember, setSelectedJuryMember] = useState<string>('Overall');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sortField, setSortField] = useState<string>('teamName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [trackFilter, setTrackFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load ratings from database
  const loadRatings = async (jurorId: string) => {
    if (!jurorId || jurorId === 'Overall') return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/jury-ratings?judgeId=${encodeURIComponent(jurorId)}`);
      if (response.ok) {
        const savedRatings = await response.json();
        setRatings(savedRatings);
      } else {
        console.error('Failed to load ratings:', response.statusText);
        setRatings({});
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
      setRatings({});
    } finally {
      setIsLoading(false);
    }
  };

  // Load all ratings for overall view
  const loadAllRatings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jury-ratings/all');
      if (response.ok) {
        const allRatings = await response.json();
        setAllJurorRatings(allRatings);
      } else {
        console.error('Failed to load all ratings:', response.statusText);
        setAllJurorRatings({});
      }
    } catch (error) {
      console.error('Error loading all ratings:', error);
      setAllJurorRatings({});
    } finally {
      setIsLoading(false);
    }
  };

  // Import ratings from CSV file
  const importFromCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        // Expected headers: Team,Room,Team #,Project,Tracks,Add-on Tracks,Concept,Quality,Implementation,Passthrough Camera API,Immersive Entertainment,Hand Tracking,MR and VR,Project Upgrade,Average,Notes
        const expectedHeaders = ['Team', 'Room', 'Team #', 'Project', 'Tracks', 'Add-on Tracks', 'Concept', 'Quality', 'Implementation', 'Passthrough Camera API', 'Immersive Entertainment', 'Hand Tracking', 'MR and VR', 'Project Upgrade', 'Average', 'Notes'];

        // Check if this looks like our CSV format
        const hasRequiredHeaders = ['Team', 'Concept', 'Quality', 'Implementation'].every(required =>
          headers.some(h => h.toLowerCase().includes(required.toLowerCase()))
        );

        if (!hasRequiredHeaders) {
          throw new Error('CSV format not recognized. Please use the exported CSV format.');
        }

        const importedRatings: Record<string, TeamRating> = {};
        let importCount = 0;

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));

          if (row.length < headers.length) continue; // Skip incomplete rows

          const teamName = row[headers.indexOf('Team')] || row[0];
          const roomNumber = row[headers.indexOf('Room')] || row[1];
          const teamNumber = row[headers.indexOf('Team #')] || row[2];
          const projectName = row[headers.indexOf('Project')] || row[3];
          const tracks = row[headers.indexOf('Tracks')] || row[4] || '';
          const addonTracks = row[headers.indexOf('Add-on Tracks')] || row[5] || '';

          // Find concept, quality, implementation scores
          const concept = parseFloat(row[headers.indexOf('Concept')] || row[6]) || 0;
          const quality = parseFloat(row[headers.indexOf('Quality')] || row[7]) || 0;
          const implementation = parseFloat(row[headers.indexOf('Implementation')] || row[8]) || 0;
          const passthroughCameraAPI = parseFloat(row[headers.indexOf('Passthrough Camera API')] || row[9]) || 0;
          const immersiveEntertainment = parseFloat(row[headers.indexOf('Immersive Entertainment')] || row[10]) || 0;
          const handTracking = parseFloat(row[headers.indexOf('Hand Tracking')] || row[11]) || 0;
          const mrAndVR = parseFloat(row[headers.indexOf('MR and VR')] || row[12]) || 0;
          const projectUpgrade = parseFloat(row[headers.indexOf('Project Upgrade')] || row[13]) || 0;
          const notes = row[headers.indexOf('Notes')] || row[15] || '';

          if (!teamName) continue; // Skip rows without team name

          // Calculate total (average of non-zero scores)
          const scores = [concept, quality, implementation, passthroughCameraAPI, immersiveEntertainment, handTracking, mrAndVR, projectUpgrade];
          const nonZeroScores = scores.filter(score => score > 0);
          const total = nonZeroScores.length > 0 ? nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length : 0;

          // Use team name + floor as key (assuming floor 1 for imports)
          const teamKey = `${teamName}-1`;

          importedRatings[teamKey] = {
            teamName,
            teamNumber,
            projectName,
            roomNumber,
            tracks,
            addonTracks,
            concept,
            quality,
            implementation,
            passthroughCameraAPI,
            immersiveEntertainment,
            handTracking,
            mrAndVR,
            projectUpgrade,
            notes,
            total
          };

          importCount++;
        }

        if (importCount === 0) {
          throw new Error('No valid rating data found in CSV file');
        }

        // Save the imported ratings
        if (selectedJuryMember && selectedJuryMember !== 'Overall') {
          await saveRatings(selectedJuryMember, importedRatings);
          setRatings(importedRatings);

          toast({
            title: "CSV Import Successful",
            description: `Successfully imported ${importCount} team ratings for ${selectedJuryMember}`,
          });
        } else {
          toast({
            title: "Select a Juror",
            description: "Please select a specific juror before importing CSV data.",
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error('CSV Import error:', error);
        toast({
          title: "CSV Import Failed",
          description: error instanceof Error ? error.message : "Failed to import CSV. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    input.click();
  };

  // Save ratings to database
  const saveRatings = async (jurorId: string, ratingsToSave: Record<string, TeamRating>) => {
    if (!jurorId || jurorId === 'Overall') return;

    try {
      const response = await fetch('/api/jury-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgeId: jurorId, ratings: ratingsToSave }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Ratings saved:', result.message);
        return result;
      } else {
        const error = `Failed to save ratings: ${response.statusText}`;
        console.error(error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save ratings to database. Changes may be lost.",
        });
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error saving ratings:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Network error while saving ratings.",
      });
      throw error;
    }
  };

  // Update a specific rating in database
  const updateRatingInDB = async (jurorId: string, teamKey: string, rating: TeamRating) => {
    if (!jurorId || jurorId === 'Overall') return;

    try {
      const response = await fetch('/api/jury-ratings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgeId: jurorId, teamKey, rating }),
      });

      if (!response.ok) {
        console.error('Failed to update rating:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  // Update team tracks in room database
  const updateTeamTracks = async (teamKey: string, roomNumber: string, tracks: string, addonTracks: string) => {
    const team = teamsWithRooms[teamKey];
    if (!team || !team.teamNumber) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to identify team number for track update",
      });
      return;
    }

    try {
      const response = await fetch('/api/rooms.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateTracks',
          roomNumber: `${roomNumber}-${team.teamNumber}`,
          teamNumber: team.teamNumber,
          tracks,
          addonTracks
        }),
      });

      if (response.ok) {
        toast({
          title: "Tracks updated",
          description: `Updated tracks for ${team.teamName}`,
        });
        // Reload rooms to reflect changes
        const roomsResponse = await fetch('/api/rooms.json');
        if (roomsResponse.ok) {
          const rooms = await roomsResponse.json();
          setAllRooms(rooms);
        }
      } else {
        throw new Error('Failed to update tracks');
      }
    } catch (error) {
      console.error('Error updating tracks:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update team tracks",
      });
    }
  };

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

  // Load ratings when jury member changes
  useEffect(() => {
    if (selectedJuryMember === 'Overall') {
      setRatings({});
      loadAllRatings(); // Load all ratings for aggregate view
    } else if (selectedJuryMember) {
      loadRatings(selectedJuryMember);
    } else {
      setRatings({});
    }
  }, [selectedJuryMember]);

  // Cleanup timeout on unmount or juror change
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // Auto-save when ratings change
  useEffect(() => {
    if (selectedJuryMember && selectedJuryMember !== 'Overall' && Object.keys(ratings).length > 0) {
      console.log('Ratings changed, setting up auto-save for:', selectedJuryMember);

      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for debounced save
      const newTimeout = setTimeout(async () => {
        console.log('useEffect auto-save triggered for:', selectedJuryMember);
        try {
          await saveRatings(selectedJuryMember, ratings);
          console.log('useEffect auto-save successful for:', selectedJuryMember);
        } catch (error) {
          console.error('useEffect auto-save failed:', error);
        }
      }, 1000);

      setSaveTimeout(newTimeout);
    }
  }, [ratings, selectedJuryMember]);

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
          tracks: room.tracks || '',
          addonTracks: room.addonTracks || '',
          floorId: room.floorId
        };
      }
      return acc;
    }, {} as Record<string, { teamName: string; teamNumber: string; projectName: string; roomNumber: string; tracks: string; addonTracks: string; floorId: string }>);

  // Calculate average across all jurors for a team
  const calculateTeamAverage = (teamKey: string): number => {
    const jurorScores = JURY_MEMBERS
      .filter(juror => juror !== 'Overall')
      .map(juror => {
        const jurorRatings = allJurorRatings[juror];
        return jurorRatings?.[teamKey]?.total || 0;
      })
      .filter(total => total > 0); // Only count rated entries

    if (jurorScores.length === 0) return 0;
    return jurorScores.reduce((sum, total) => sum + total, 0) / jurorScores.length;
  };

  // Helper function to get sort value safely
  const getSortValue = (team: any, sortField: string) => {
    const teamKey = `${team.teamName}-${team.floorId}`;
    const teamRating = ratings[teamKey];

    switch (sortField) {
      case 'teamName':
        return team.teamName || '';
      case 'teamNumber':
        return parseInt((team.teamNumber || '').replace(/\D/g, '')) || 0;
      case 'projectName':
        return team.projectName || '';
      case 'roomNumber':
        return parseInt((team.roomNumber || '').replace(/\D/g, '')) || 0;
      case 'tracks':
        return teamRating?.tracks || '';
      case 'addonTracks':
        return teamRating?.addonTracks || '';
      case 'total':
        if (selectedJuryMember === 'Overall') {
          return calculateTeamAverage(teamKey) || 0;
        } else {
          return teamRating?.total || 0;
        }
      case 'average':
        return calculateTeamAverage(teamKey) || 0;
      case 'concept':
      case 'quality':
      case 'implementation':
      case 'passthroughCameraAPI':
      case 'immersiveEntertainment':
      case 'handTracking':
      case 'mrAndVR':
      case 'projectUpgrade':
        return teamRating?.[sortField as keyof TeamRating] || 0;
      default:
        return team.teamName || '';
    }
  };

  const sortedTeams = Object.values(teamsWithRooms).sort((a, b) => {
    // Handle default sorting first
    if (!sortField || sortField === '') {
      const floorCompare = parseInt(a.floorId) - parseInt(b.floorId);
      if (floorCompare !== 0) return floorCompare;
      return (a.teamName || '').localeCompare(b.teamName || '');
    }

    // Get sort values using helper function
    const aValue = getSortValue(a, sortField);
    const bValue = getSortValue(b, sortField);

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }

    // Handle numeric comparison
    const aNum = Number(aValue) || 0;
    const bNum = Number(bValue) || 0;
    const comparison = aNum - bNum;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Check if a scoring field should be disabled based on track selection
  const isTrackFieldDisabled = (tracks: string, addonTracks: string, field: string): boolean => {
    const primaryTrack = tracks?.toLowerCase() || '';
    const addOnTrack = addonTracks?.toLowerCase() || '';

    switch (field) {
      case 'passthroughCameraAPI':
        return !primaryTrack.includes('passthrough camera api') && !addOnTrack.includes('passthrough camera api');
      case 'immersiveEntertainment':
        return !primaryTrack.includes('immersive entertainment') && !addOnTrack.includes('immersive entertainment');
      case 'handTracking':
        return !primaryTrack.includes('hand tracking') && !addOnTrack.includes('hand tracking');
      case 'mrAndVR':
        return !primaryTrack.includes('mr and vr') && !addOnTrack.includes('mr and vr');
      case 'projectUpgrade':
        return !primaryTrack.includes('project upgrade') && !addOnTrack.includes('project upgrade');
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
    console.log('updateRating called:', { teamKey, field, value, selectedJuryMember });

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
          mrAndVR: 0,
          projectUpgrade: 0,
          notes: '',
          total: 0
        };
      }

      newRatings[teamKey] = {
        ...newRatings[teamKey],
        [field]: value
      };

      // Calculate average (all 8 criteria, max 5 each)
      const r = newRatings[teamKey];
      const scores = [r.concept, r.quality, r.implementation, r.passthroughCameraAPI, r.immersiveEntertainment, r.handTracking, r.mrAndVR, r.projectUpgrade];
      const nonZeroScores = scores.filter(score => score > 0);
      r.total = nonZeroScores.length > 0 ? nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length : 0;

      return newRatings;
    });
  };

  // Calculate average for a specific field across all jurors
  const calculateFieldAverage = (teamKey: string, field: keyof TeamRating): number => {
    if (typeof field === 'string' && ['concept', 'quality', 'implementation', 'passthroughCameraAPI', 'immersiveEntertainment', 'handTracking'].includes(field)) {
      const fieldScores = JURY_MEMBERS
        .filter(juror => juror !== 'Overall')
        .map(juror => {
          const jurorRatings = allJurorRatings[juror];
          const rating = jurorRatings?.[teamKey];
          return rating?.[field] || 0;
        })
        .filter(score => score > 0); // Only count rated entries

      if (fieldScores.length === 0) return 0;
      return fieldScores.reduce((sum, score) => sum + score, 0) / fieldScores.length;
    }
    return 0;
  };

  // Get most common track selection across all jurors
  const getMostCommonTrack = (teamKey: string, field: 'tracks' | 'addonTracks'): string => {
    const trackCounts: Record<string, number> = {};

    JURY_MEMBERS
      .filter(juror => juror !== 'Overall')
      .forEach(juror => {
        const jurorRatings = allJurorRatings[juror];
        const track = jurorRatings?.[teamKey]?.[field];
        if (track && track !== '') {
          trackCounts[track] = (trackCounts[track] || 0) + 1;
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

  // Get all notes from all jurors for overall view
  const getAllNotes = (teamKey: string): Array<{ juror: string; notes: string }> => {
    const allNotes: Array<{ juror: string; notes: string }> = [];

    JURY_MEMBERS
      .filter(juror => juror !== 'Overall')
      .forEach(juror => {
        const jurorRatings = allJurorRatings[juror];
        const notes = jurorRatings?.[teamKey]?.notes;
        if (notes && notes.trim() !== '') {
          allNotes.push({ juror, notes: notes.trim() });
        }
      });

    return allNotes;
  };

  const saveRatingsManual = async () => {
    if (!selectedJuryMember || selectedJuryMember === 'Overall') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot save in Overall view. Please select a specific juror.",
      });
      return;
    }

    try {
      await saveRatings(selectedJuryMember, ratings);
      toast({
        title: "Manual save completed",
        description: `Ratings manually saved for ${selectedJuryMember}. (Auto-save is enabled)`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save ratings to database.",
      });
    }
  };

  const clearRatings = async () => {
    if (!selectedJuryMember || selectedJuryMember === 'Overall') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot clear ratings in Overall view. Please select a specific juror.",
      });
      return;
    }
    if (confirm(`Are you sure you want to clear all ratings for ${selectedJuryMember}?`)) {
      try {
        setRatings({});

        // Clear from database
        const response = await fetch(`/api/jury-ratings?judgeId=${encodeURIComponent(selectedJuryMember)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast({
            title: "Ratings cleared",
            description: `All ratings for ${selectedJuryMember} have been removed.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Clear failed",
            description: "Failed to clear ratings from database.",
          });
        }
      } catch (error) {
        console.error('Error clearing ratings:', error);
        toast({
          variant: "destructive",
          title: "Clear error",
          description: "Network error while clearing ratings.",
        });
      }
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

    const headers = ['Team', 'Room', 'Team #', 'Project', 'Tracks', 'Add-on Tracks', 'Concept', 'Quality', 'Implementation', 'Passthrough Camera API', 'Immersive Entertainment', 'Hand Tracking', 'MR and VR', 'Project Upgrade', 'Average', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...sortedTeams.map(team => {
        const key = `${team.teamName}-${team.floorId}`;

        if (selectedJuryMember === 'Overall') {
          // Export aggregate data for Overall view
          const allNotes = getAllNotes(key);
          const aggregatedNotes = allNotes
            .map(note => `${note.juror}: ${note.notes}`)
            .join(' | ');

          return [
            `"${team.teamName}"`,
            team.roomNumber,
            `"${team.teamNumber}"`,
            `"${team.projectName}"`,
            `"${team.tracks}"`,
            `"${team.addonTracks}"`,
            calculateFieldAverage(key, 'concept').toFixed(1),
            calculateFieldAverage(key, 'quality').toFixed(1),
            calculateFieldAverage(key, 'implementation').toFixed(1),
            calculateFieldAverage(key, 'passthroughCameraAPI').toFixed(1),
            calculateFieldAverage(key, 'immersiveEntertainment').toFixed(1),
            calculateFieldAverage(key, 'handTracking').toFixed(1),
            calculateFieldAverage(key, 'mrAndVR').toFixed(1),
            calculateFieldAverage(key, 'projectUpgrade').toFixed(1),
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
            r.mrAndVR,
            r.projectUpgrade,
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
              <label className="block text-sm font-semibold mb-2">Select Juror:</label>
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
            <Button onClick={importFromCSV} variant="outline" size="default">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
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

        {/* Winners and Runners Up - Only show in Overall view */}
        {selectedJuryMember === 'Overall' && (
          <div className="mb-8 bg-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-center">🏆 Track Winners & Runners Up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRACK_OPTIONS.filter(track => track && track.trim() !== '').map(track => {
                // Get teams participating in this track (main or addon)
                const trackTeams = Object.values(teamsWithRooms)
                  .filter(team => team.tracks === track || team.addonTracks === track)
                  .map(team => {
                    const key = `${team.teamName}-${team.floorId}`;
                    const averageScore = calculateTeamAverage(key);
                    return {
                      ...team,
                      averageScore,
                      key
                    };
                  })
                  .filter(team => team.averageScore > 0)
                  .sort((a, b) => b.averageScore - a.averageScore);

                const winner = trackTeams[0];
                const runnerUp = trackTeams[1];

                return (
                  <div key={track} className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-center text-primary">
                      {track}
                    </h4>

                    {winner ? (
                      <>
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-500 text-lg">🥇</span>
                            <span className="font-medium text-sm">Winner</span>
                          </div>
                          <div className="bg-background rounded p-2 text-sm">
                            <div className="font-medium">{winner.teamName}</div>
                            <div className="text-muted-foreground text-xs">
                              {winner.roomNumber} • Score: {winner.averageScore.toFixed(1)}
                            </div>
                          </div>
                        </div>

                        {runnerUp && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-400 text-lg">🥈</span>
                              <span className="font-medium text-sm">Runner Up</span>
                            </div>
                            <div className="bg-background rounded p-2 text-sm">
                              <div className="font-medium">{runnerUp.teamName}</div>
                              <div className="text-muted-foreground text-xs">
                                {runnerUp.roomNumber} • Score: {runnerUp.averageScore.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-4">
                        No teams with scores yet
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


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
                    onClick={() => handleSort('roomNumber')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'roomNumber' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Room {sortField === 'roomNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => handleSort('total')}
                    className={`px-3 py-1 rounded-md border hover:bg-muted ${sortField === 'total' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {selectedJuryMember === 'Overall' ? 'Score' : 'Average'} {sortField === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>

              {sortedTeams
                .filter(team => {
                  if (!trackFilter) return true;

                  // Filter by team tracks (now stored in room data)
                  return team.tracks === trackFilter || team.addonTracks === trackFilter;
                })
                .map((team, index) => {
                const key = `${team.teamName}-${team.floorId}`;
                let rating: TeamRating;

                if (selectedJuryMember === 'Overall') {
                  // Show aggregate data for Overall view
                  const allNotes = getAllNotes(key);
                  const aggregatedNotes = allNotes
                    .map(note => `${note.juror}: ${note.notes}`)
                    .join(' | ');

                  rating = {
                    teamName: team.teamName,
                    teamNumber: team.teamNumber,
                    projectName: team.projectName,
                    roomNumber: team.roomNumber,
                    tracks: team.tracks,
                    addonTracks: team.addonTracks,
                    concept: calculateFieldAverage(key, 'concept'),
                    quality: calculateFieldAverage(key, 'quality'),
                    implementation: calculateFieldAverage(key, 'implementation'),
                    passthroughCameraAPI: calculateFieldAverage(key, 'passthroughCameraAPI'),
                    immersiveEntertainment: calculateFieldAverage(key, 'immersiveEntertainment'),
                    handTracking: calculateFieldAverage(key, 'handTracking'),
                    mrAndVR: calculateFieldAverage(key, 'mrAndVR'),
                    projectUpgrade: calculateFieldAverage(key, 'projectUpgrade'),
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
                    tracks: team.tracks,
                    addonTracks: team.addonTracks,
                    concept: 0,
                    quality: 0,
                    implementation: 0,
                    passthroughCameraAPI: 0,
                    immersiveEntertainment: 0,
                    handTracking: 0,
                    mrAndVR: 0,
                    projectUpgrade: 0,
                    notes: '',
                    total: 0
                  };
                }
                const isExpanded = expandedRows.has(key);
                const isJudged = selectedJuryMember !== 'Overall' && hasBeenJudged(rating);

                return (
                  <div key={key} className={`border rounded-lg transition-colors ${
                    isJudged
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/30'
                      : 'bg-background hover:bg-muted/20'
                  }`}>
                    {/* Collapsed row - always visible */}
                    <div
                      className="p-4 cursor-pointer select-none"
                      onClick={() => toggleRowExpansion(key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-1">
                            <div className="grid grid-cols-[2fr,100px,80px,1fr] gap-4 items-center">
                              <span className="font-medium text-sm lg:text-base truncate">{team.teamName}</span>
                              <span className="text-sm lg:text-base text-muted-foreground text-left">Room {team.roomNumber}</span>
                              {team.teamNumber ? (
                                <span className="font-bold text-sm lg:text-base text-purple-600 dark:text-purple-400 text-left">{team.teamNumber}</span>
                              ) : (
                                <span></span>
                              )}
                              {team.projectName && (
                                <span className="text-xs lg:text-sm text-blue-600 dark:text-blue-400 truncate">{team.projectName}</span>
                              )}
                            </div>
                          </div>
                          {(rating.tracks || rating.addonTracks) && (
                            <div className="flex gap-1">
                              {rating.tracks && (
                                <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${getTrackColor(rating.tracks)}`}>
                                  {rating.tracks}
                                </span>
                              )}
                              {rating.addonTracks && (
                                <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${getTrackColor(rating.addonTracks)}`}>
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
                          <div className="flex items-center gap-2">
                            {isJudged && (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <span className="text-lg">✓</span>
                              </div>
                            )}
                            <div className="text-lg">
                              {isExpanded ? '−' : '+'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded scoring section */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t bg-muted/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Track Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Track Information</h4>
                            {selectedJuryMember === 'Overall' ? (
                              <p className="text-xs text-muted-foreground">Edit tracks here to update room data</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">Tracks are set in the room edit modal</p>
                            )}
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Primary Track</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <select
                                    value={team.tracks || 'none'}
                                    onChange={(e) => {
                                      const newTracks = e.target.value === 'none' ? '' : e.target.value;
                                      updateTeamTracks(key, team.roomNumber, newTracks, team.addonTracks);
                                    }}
                                    className="w-full px-3 py-2 border rounded bg-background text-sm"
                                  >
                                    <option value="none">None</option>
                                    {TRACK_OPTIONS.filter(t => t).map(track => (
                                      <option key={track} value={track}>{track}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm">
                                    {team.tracks || 'None'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Add-on Track</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <select
                                    value={team.addonTracks || 'none'}
                                    onChange={(e) => {
                                      const newAddonTracks = e.target.value === 'none' ? '' : e.target.value;
                                      updateTeamTracks(key, team.roomNumber, team.tracks, newAddonTracks);
                                    }}
                                    className="w-full px-3 py-2 border rounded bg-background text-sm"
                                  >
                                    <option value="none">None</option>
                                    {TRACK_OPTIONS.filter(t => t).map(track => (
                                      <option key={track} value={track}>{track}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm">
                                    {team.addonTracks || 'None'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Scoring Grid */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">
                              {selectedJuryMember === 'Overall' ? 'Average Scores (All Jurors)' : 'Scores (1-5)'}
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
                                    disabled={isTrackFieldDisabled(team.tracks, team.addonTracks, 'passthroughCameraAPI')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(team.tracks, team.addonTracks, 'passthroughCameraAPI') ? 'opacity-50 cursor-not-allowed' : ''
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
                                    disabled={isTrackFieldDisabled(team.tracks, team.addonTracks, 'immersiveEntertainment')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(team.tracks, team.addonTracks, 'immersiveEntertainment') ? 'opacity-50 cursor-not-allowed' : ''
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
                                    disabled={isTrackFieldDisabled(team.tracks, team.addonTracks, 'handTracking')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(team.tracks, team.addonTracks, 'handTracking') ? 'opacity-50 cursor-not-allowed' : ''
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
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">MR and VR</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.mrAndVR > 0 ? rating.mrAndVR.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.mrAndVR}
                                    onChange={(e) => updateRating(key, 'mrAndVR', parseInt(e.target.value))}
                                    disabled={isTrackFieldDisabled(team.tracks, team.addonTracks, 'mrAndVR')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(team.tracks, team.addonTracks, 'mrAndVR') ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`mrvr-${option.value}`} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-muted-foreground mb-1">Project Upgrade</label>
                                {selectedJuryMember === 'Overall' ? (
                                  <div className="w-full px-2 py-2 border rounded bg-muted/20 text-center text-sm">
                                    {rating.projectUpgrade > 0 ? rating.projectUpgrade.toFixed(1) : '-'}
                                  </div>
                                ) : (
                                  <select
                                    value={rating.projectUpgrade}
                                    onChange={(e) => updateRating(key, 'projectUpgrade', parseInt(e.target.value))}
                                    disabled={isTrackFieldDisabled(team.tracks, team.addonTracks, 'projectUpgrade')}
                                    className={`w-full px-2 py-2 border rounded bg-background text-center text-sm ${
                                      isTrackFieldDisabled(team.tracks, team.addonTracks, 'projectUpgrade') ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {SCORE_OPTIONS.map(option => (
                                      <option key={`project-upgrade-${option.value}`} value={option.value}>
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
                            {selectedJuryMember === 'Overall' ? 'All Juror Notes' : 'Notes'}
                          </h4>
                          {selectedJuryMember === 'Overall' ? (
                            <div className="w-full px-3 py-2 border rounded bg-muted/20 text-sm min-h-[60px]">
                              {rating.notes ? (
                                <div className="space-y-2">
                                  {getAllNotes(key).map((note, idx) => (
                                    <div key={idx} className="border-b border-muted pb-1 last:border-b-0">
                                      <span className="font-medium text-primary">{note.juror}:</span> {note.notes}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                'No notes from any jurors yet'
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