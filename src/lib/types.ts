
export interface Floor {
  id: string;
  name: string;
  level: number;
}

export interface Room {
  id: string;
  name: string;
  floorId: string;
  notes?: string; // Added optional notes property
}

export interface FloorData {
  floors: Floor[];
  rooms: Room[];
}
