
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

import * as floorBData from '@/components/floor-svgs/floor-b';
import * as floor1Data from '@/components/floor-svgs/floor-1';
import * as floor2Data from '@/components/floor-svgs/floor-2';
import * as floor3Data from '@/components/floor-svgs/floor-3';
import * as floor4Data from '@/components/floor-svgs/floor-4';
import * as floor5Data from '@/components/floor-svgs/floor-5';
import * as floor6Data from '@/components/floor-svgs/floor-6';
import * as floor7Data from '@/components/floor-svgs/floor-7';
import * as floor8Data from '@/components/floor-svgs/floor-8';
import * as floor9Data from '@/components/floor-svgs/floor-9';
import * as floor10Data from '@/components/floor-svgs/floor-10';
import * as floor11Data from '@/components/floor-svgs/floor-11';
import * as floor12Data from '@/components/floor-svgs/floor-12';
import * as floor13Data from '@/components/floor-svgs/floor-13';
import * as floor14Data from '@/components/floor-svgs/floor-14';
import * as floor15Data from '@/components/floor-svgs/floor-15';
import * as floor16Data from '@/components/floor-svgs/floor-16';
import * as floorRoofData from '@/components/floor-svgs/floor-roof';

const floorModules = [
  floorBData,
  floor1Data,
  floor2Data,
  floor3Data,
  floor4Data,
  floor5Data,
  floor6Data,
  floor7Data,
  floor8Data,
  floor9Data,
  floor10Data,
  floor11Data,
  floor12Data,
  floor13Data,
  floor14Data,
  floor15Data,
  floor16Data,
  floorRoofData,
];

export const allFloors: Floor[] = floorModules.map(module => ({
  id: module.id,
  name: module.name,
  level: module.level,
}));

  
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
