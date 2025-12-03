export interface Floor {
  id: string;
  name: string;
  level: number;
}

export interface Room {
  id: string;
  name: string;
  teamName?: string;
  notes?: string;
  color: string;
  coords: [number, number, number, number];
  floorId?: string; // Add optional floorId here
}

export interface FloorData {
  floors: Floor[];
  rooms: Room[];
}
