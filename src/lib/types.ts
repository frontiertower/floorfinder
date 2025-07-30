
export interface Floor {
  id: string;
  name: string;
  level: number;
}

export interface Room {
  id: string;
  name: string;
  floorId: string;
}

export interface FloorData {
  floors: Floor[];
  rooms: Room[];
}
