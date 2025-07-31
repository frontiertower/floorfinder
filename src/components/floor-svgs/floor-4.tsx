import { CommonUpper } from './common-upper';
import { Room } from './Room';
import type { Room as RoomType } from '@/lib/types';

export const id = '4';
export const name = 'Robotics & Hard Tech';
export const level = 4;

export const rooms: RoomType[] = [
  { id: 'f4r1', name: 'Robotics Lab', floorId: '4', notes: 'This is the main robotics laboratory on floor 4.' },
];

interface Floor4Props {
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: RoomType[];
  onMouseEnterRoom: (room: RoomType, position: { x: number; y: number }) => void;
  onMouseLeaveRoom: () => void;
}

export const Floor4: React.FC<Floor4Props> = ({ highlightedRoomId, onRoomClick, rooms, onMouseEnterRoom, onMouseLeaveRoom }) => {
  const roomData = rooms.find(room => room.id === 'f4r1');

  return (
    <g data-floor-id="4">
      <CommonUpper />
      {/* Use the Room component and pass hover handlers */}
      {roomData && (
        <Room
          key={roomData.id}
          id={roomData.id}
          name={roomData.name}
          coords={[33, 6, 13, 13]}
          color="rgba(255, 200, 200, .5)"
          notes={roomData.notes}
          floorId={roomData.floorId}
          onMouseEnter={onMouseEnterRoom}
          onMouseLeave={onMouseLeaveRoom}
        />
      )}
    </g>
  );
};
