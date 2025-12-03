
import type { Floor, Room } from './types';
// import { Floor0 } from '@/components/floor-svgs/floor-0';
// import { Floor1 } from '@/components/floor-svgs/floor-1';
import { Floor2 } from '@/components/floor-svgs/floor-2';
// import { Floor3 } from '@/components/floor-svgs/floor-3';
// import { Floor4 } from '@/components/floor-svgs/floor-4';
// import { Floor5 } from '@/components/floor-svgs/floor-5';
import { Floor6 } from '@/components/floor-svgs/floor-6';
import { Floor7 } from '@/components/floor-svgs/floor-7';
// import { Floor8 } from '@/components/floor-svgs/floor-8';
import { Floor9 } from '@/components/floor-svgs/floor-9';
// import { Floor10 } from '@/components/floor-svgs/floor-10';
// import { Floor11 } from '@/components/floor-svgs/floor-11';
import { Floor12 } from '@/components/floor-svgs/floor-12';
// import { Floor13 } from '@/components/floor-svgs/floor-13';
import { Floor14 } from '@/components/floor-svgs/floor-14';
import { Floor15 } from '@/components/floor-svgs/floor-15';
import { Floor16 } from '@/components/floor-svgs/floor-16';
// import { Floor17 } from '@/components/floor-svgs/floor-17';

// import * as floor0Data from '@/components/floor-svgs/floor-0';
// import * as floor1Data from '@/components/floor-svgs/floor-1';
import * as floor2Data from '@/components/floor-svgs/floor-2';
// import * as floor3Data from '@/components/floor-svgs/floor-3';
// import * as floor4Data from '@/components/floor-svgs/floor-4';
// import * as floor5Data from '@/components/floor-svgs/floor-5';
import * as floor6Data from '@/components/floor-svgs/floor-6';
import * as floor7Data from '@/components/floor-svgs/floor-7';
// import * as floor8Data from '@/components/floor-svgs/floor-8';
import * as floor9Data from '@/components/floor-svgs/floor-9';
// import * as floor10Data from '@/components/floor-svgs/floor-10';
// import * as floor11Data from '@/components/floor-svgs/floor-11';
import * as floor12Data from '@/components/floor-svgs/floor-12';
// import * as floor13Data from '@/components/floor-svgs/floor-13';
import * as floor14Data from '@/components/floor-svgs/floor-14';
import * as floor15Data from '@/components/floor-svgs/floor-15';
import * as floor16Data from '@/components/floor-svgs/floor-16';
// import * as floor17Data from '@/components/floor-svgs/floor-17';

const floorModules = [
//  floor0Data,
//  floor1Data,
  floor2Data,
//  floor3Data,
//  floor4Data,
//  floor5Data,
  floor6Data,
  floor7Data,
//  floor8Data,
  floor9Data,
//  floor10Data,
//  floor11Data,
  floor12Data,
//  floor13Data,
  floor14Data,
  floor15Data,
  floor16Data,
//  floor17Data,
];

export const allFloors: Floor[] = floorModules.map(module => ({
  id: module.id,
  name: module.name,
  level: module.level,
}));
  
export const floorComponentMap: { [key: string]: React.ComponentType<any> } = {
//    '0': Floor0,
//    '1': Floor1,
    '2': Floor2,
//    '3': Floor3,
//    '4': Floor4,
//    '5': Floor5,
    '6': Floor6,
    '7': Floor7,
//    '8': Floor8,
    '9': Floor9,
//    '10': Floor10,
//    '11': Floor11,
    '12': Floor12,
    '14': Floor14,
    '15': Floor15,
    '16': Floor16,
//    '17': Floor17,
};
