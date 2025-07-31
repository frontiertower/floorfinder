
import type { Floor, Room } from './types';
import { FloorB } from '@/components/floor-svgs/floor-b';
import { Floor1 } from '@/components/floor-svgs/floor-1';
import { Floor2 } from '@/components/floor-svgs/floor-2';
import { Floor3 } from '@/components/floor-svgs/floor-3';
import { Floor4 } from '@/components/floor-svgs/floor-4';
import { Floor5 } from '@/components/floor-svgs/floor-5';
import { Floor6 } from '@/components/floor-svgs/floor-6';
import { Floor7 } from '@/components/floor-svgs/floor-7';
import { Floor8 } from '@/components/floor-svgs/floor-8';
import { Floor9 } from '@/components/floor-svgs/floor-9';
import { Floor10 } from '@/components/floor-svgs/floor-10';
import { Floor11 } from '@/components/floor-svgs/floor-11';
import { Floor12 } from '@/components/floor-svgs/floor-12';
import { Floor13 } from '@/components/floor-svgs/floor-13';
import { Floor14 } from '@/components/floor-svgs/floor-14';
import { Floor15 } from '@/components/floor-svgs/floor-15';
import { Floor16 } from '@/components/floor-svgs/floor-16';
import { FloorRoof } from '@/components/floor-svgs/floor-roof';

import * as floor1Rooms from '@/components/floor-svgs/floor-1';
import * as floor2Rooms from '@/components/floor-svgs/floor-2';
// ... import other floor room data if they export it

export const allFloors: Floor[] = [
    { id: 'b', name: 'Basement', level: 0 },
    { id: '1', name: 'Floor 1', level: 1 },
    { id: '2', name: 'Floor 2', level: 2 },
    { id: '3', name: 'Floor 3', level: 3 },
    { id: '4', name: 'Floor 4', level: 4 },
    { id: '5', name: 'Floor 5', level: 5 },
    { id: '6', name: 'Floor 6', level: 6 },
    { id: '7', name: 'Floor 7', level: 7 },
    { id: '8', name: 'Floor 8', level: 8 },
    { id: '9', name: 'Floor 9', level: 9 },
    { id: '10', name: 'Floor 10', level: 10 },
    { id: '11', name: 'Floor 11', level: 11 },
    { id: '12', name: 'Floor 12', level: 12 },
    { id: '13', name: 'Floor 13', level: 13 },
    { id: '14', name: 'Floor 14', level: 14 },
    { id: '15', name: 'Floor 15', level: 15 },
    { id: '16', name: 'Floor 16', level: 16 },
    { id: 'roof', name: 'Roof', level: 17 },
  ];
  
  const allRooms: Room[] = [
    // Floor 1
    { id: 'f1r1', name: 'Lobby', floorId: '1', coords: [2.5, 2.5, 20, 20], color: 'rgba(255, 255, 255, 1)' },
    { id: 'f1r2', name: 'Reception', floorId: '1', coords: [25, 2.5, 22.5, 9.5], color: 'rgba(255, 255, 255, 1)' },
    { id: 'f1r3', name: 'Mail Room', floorId: '1', coords: [25, 13, 22.5, 9.5], color: 'rgba(255, 255, 255, 1)' },
    // Floor 2
    { id: 'f2r1', name: 'Open Office', floorId: '2', coords: [2.5, 2.5, 45, 15], color: 'rgba(255, 255, 255, 1)' },
    { id: 'f2r2', name: 'Conference Room', floorId: '2', coords: [2.5, 18.5, 22, 4], color: 'rgba(255, 255, 255, 1)' },
    { id: 'f2r3', name: 'Kitchenette', floorId: '2', coords: [25.5, 18.5, 22, 4], color: 'rgba(255, 255, 255, 1)' },
    // Floor 4
    { id: 'f4r1', floorId: '4', name: 'Robotics Lab', notes: 'This is the main robotics laboratory on floor 4.', color: 'rgba(255, 200, 200, .5)', coords: [33, 6, 13, 13] },
    // Floor 5
    { id: 'f5r1', name: 'Fitness Area', floorId: '5', notes: 'Exercise equipment and open space for activities.', color: 'rgba(200, 255, 200, .5)', coords: [10, 5, 15, 8] },
    // Floor 6
    { id: 'f6r1', name: 'Music Studio A', floorId: '6', notes: 'Equipped for recording and practice.', color: 'rgba(200, 200, 255, .5)', coords: [5, 5, 10, 10] },
    { id: 'f6r2', name: 'Art Workshop', floorId: '6', notes: 'Space for various art projects.', color: 'rgba(200, 200, 255, .5)', coords: [20, 5, 10, 10] },
    // Floor 7
    { id: 'f7r1', name: '3D Printing Zone', floorId: '7', notes: 'Equipped with 3D printers.', color: 'rgba(255, 255, 200, .5)', coords: [5, 5, 10, 10] },
    { id: 'f7r2', name: 'Laser Cutting Area', floorId: '7', notes: 'Area for laser cutting.', color: 'rgba(255, 255, 200, .5)', coords: [20, 5, 10, 10] },
    // Floor 8
    { id: 'f8r1', name: 'Neuroscience Lab', floorId: '8', notes: 'Lab for neuroscience research.', color: 'rgba(200, 200, 200, .5)', coords: [5, 5, 10, 10] },
    { id: 'f8r2', name: 'Biotech Lab', floorId: '8', notes: 'Lab for biotechnology research.', color: 'rgba(200, 200, 200, .5)', coords: [20, 5, 10, 10] },
    // Floor 9
    { id: 'f9r1', name: 'AI Development Lab', floorId: '9', notes: 'Lab for AI development.', color: 'rgba(200, 255, 255, .5)', coords: [5, 5, 10, 10] },
    { id: 'f9r2', name: 'Autonomous Systems Lab', floorId: '9', notes: 'Lab for autonomous systems.', color: 'rgba(200, 255, 255, .5)', coords: [20, 5, 10, 10] },
    // Floor 10
    { id: 'f10r1', name: 'Accelerator Hot Desks', floorId: '10', notes: 'Flexible workspace for startups.', color: 'rgba(255, 200, 255, .5)', coords: [15, 7, 10, 8] },
    // Floor 11
    { id: 'f11r1', name: 'Wellness Studio', floorId: '11', notes: 'Space for relaxation and wellness activities.', color: 'rgba(200, 255, 255, .5)', coords: [20, 10, 8, 10] },
    // Floor 12
    { id: 'f12r1', name: 'Blockchain Dev Area', floorId: '12', notes: 'Area for blockchain development and discussions.', color: 'rgba(255, 200, 200, .5)', coords: [10, 10, 15, 10] },
    // Floor 14
    { id: 'f14r1', name: 'Meditation and Quiet Zone', floorId: '14', notes: 'A space for quiet reflection and meditation.', color: 'rgba(200, 255, 200, .5)', coords: [18, 8, 10, 12] },
    // Floor 15
    { id: 'f15r1', floorId: '15', name: 'Coworking Space', notes: 'Open area with desks for coworking.', color: 'rgba(255, 255, 200, .5)', coords: [5, 5, 15, 15] },
    { id: 'f15r2', floorId: '15', name: 'Library', notes: 'Quiet area for reading and focus.', color: 'rgba(255, 255, 200, .5)', coords: [25, 5, 10, 15] },
    // Floor 16
    { id: 'f16r1', name: 'Lounge', floorId: '16', notes: 'Relaxation and social area.', color: 'rgba(200, 200, 255, .5)', coords: [45, 20, 30, 20] },
    { id: 'f16r2', name: 'Dining Hall', floorId: '16', notes: 'Group lunches and dinners are here.', color: 'rgba(200, 200, 255, .5)', coords: [5, 43, 40, 10] },
    // Roof
    { id: 'roof-access', name: 'Maintenance Access', floorId: 'roof', coords: [12.5, 2.5, 5, 2], color: 'rgba(255, 255, 255, 1)' },
  ];

  export const getRoomsForFloor = (floorId: string): Room[] => {
    return allRooms.filter(room => room.floorId === floorId);
  }
  
  export const floorComponentMap: { [key: string]: React.ComponentType<any> } = {
    'b': FloorB,
    '1': Floor1,
    '2': Floor2,
    '3': Floor3,
    '4': Floor4,
    '5': Floor5,
    '6': Floor6,
    '7': Floor7,
    '8': Floor8,
    '9': Floor9,
    '10': Floor10,
    '11': Floor11,
    '12': Floor12,
    '13': Floor13,
    '14': Floor14,
    '15': Floor15,
    '16': Floor16,
    'roof': FloorRoof,
  };
  
  export const lowerFloorViewBox = '0 0 50 25';
  export const upperFloorViewBox = '0 0 95 60';
