
import { NextResponse } from 'next/server';
import type { Room } from '@/lib/types';

const allRooms: Room[] = [
    {
        "id": "f0r1",
        "name": "Robot Fight Club",
        "floorId": "0",
        "notes": "First rule of Robot Fight Club: don't talk about robot fight club.",
        "color": "rgba(255, 200, 255, .5)",
        "coords": [
            115,
            60,
            40,
            40
        ]
    },
    {
      "id": "f2r1",
      "name": "Spaceship",
      "floorId": "2",
      "coords": [
          10,
          30,
          80,
          22
      ],
      "color": "rgba(255, 255, 255, 1)"
  },
  {
      "id": "f2r2",
      "name": "Green Room",
      "floorId": "2",
      "coords": [
          8,
          56,
          10,
          10
      ],
      "color": "rgba(255, 255, 255, 1)"
  },
  {
    "id": "f4r1",
    "floorId": "4",
    "name": "Robotics Lab",
    "notes": "This is the main robotics laboratory on floor 4.",
    "color": "rgba(255, 200, 200, .5)",
    "coords": [
        35,
        56,
        13,
        13
    ]
  },
  {
    "id": "f9r1",
    "name": "Simmulation Annex",
    "floorId": "9",
    "notes": "VR Room",
    "color": "rgba(200, 255, 255, .5)",
    "coords": [
        5,
        5,
        10,
        10
    ]
  },
  {
    "id": "f10r1",
    "name": "Accelerator Hot Desks",
    "floorId": "10",
    "notes": "Flexible workspace for startups.",
    "color": "rgba(255, 200, 255, .5)",
    "coords": [
        15,
        7,
        10,
        8
    ]
  },
  {
    "id": "f15r1",
    "floorId": "15",
    "name": "Coworking Space",
    "notes": "Open area with desks for coworking.",
    "color": "rgba(255, 255, 200, .5)",
    "coords": [ 49, 40, 20, 20 ]
  },
  {
      "id": "f15r2",
      "floorId": "15",
      "name": "Deep Work Space",
      "notes": "Quiet area for reading and focus.",
      "color": "rgba(255, 255, 200, .5)",
      "coords": [ 7, 40, 15, 30 ]
  },
  {
      "id": "f15r3",
      "floorId": "15",
      "name": "Blue Room",
      "notes": "Reservable room.",
      "color": "rgba(200, 200, 255, .5)",
      "coords": [ 71, 15, 20, 10 ]
  },
  {
    "id": "f16r1",
    "name": "Lounge",
    "floorId": "16",
    "notes": "Relaxation and social area.",
    "color": "rgba(200, 200, 255, .5)",
    "coords": [
        51,
        41,
        32,
        34
    ]
  },
  {
      "id": "f16r2",
      "name": "Dining Hall",
      "floorId": "16",
      "notes": "Group lunches and dinners are here.",
      "color": "rgba(200, 200, 255, .5)",
      "coords": [
          8,
          19,
          40,
          12
      ]
  },
  {
    "id": "f17r1",
    "name": "BBQ",
    "floorId": "17",
    "notes": "BBQ & Rave",
    "color": "rgba(255, 200, 255, .5)",
    "coords": [5, 56, 10,10]
  }
];

export async function GET() {
  try {
    // For now, we return the hardcoded list.
    // In the future, this can be replaced with the Firestore call.
    return NextResponse.json(allRooms);

  } catch (error) {
    console.error("Error fetching rooms:", error);
    // It's good practice to not expose detailed error messages to the client
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
