export interface Floor {
  id: string;
  name: string;
  level: number;
}

export interface Room {
  id: string;
  name: string;
  teamName?: string;
  teamNumber?: string;
  projectName?: string;
  type?: string;
  notes?: string;
  tracks?: string;
  addonTracks?: string;
  color: string;
  coords: [number, number, number, number];
  floorId?: string; // Add optional floorId here
}

export const ROOM_TYPES = [
  'Office',
  'Meeting Room',
  'Conference Room',
  'Open Workspace',
  'Cubicle',
  'Break Room',
  'Kitchen',
  'Restroom',
  'Storage',
  'Reception',
  'Phone Booth',
  'Collaboration Space',
  'Training Room',
  'Server Room',
  'Utility',
  'Other'
] as const;

export type RoomType = typeof ROOM_TYPES[number];

export const TRACK_OPTIONS = [
  'Passthrough Camera API',
  'Immersive Entertainment',
  'Hand Tracking'
] as const;

export type TrackOption = typeof TRACK_OPTIONS[number];

export interface FloorData {
  floors: Floor[];
  rooms: Room[];
}
