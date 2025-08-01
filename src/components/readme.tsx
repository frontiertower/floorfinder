import { Blueprint } from './blueprints/floor-4';

export const id = 'readme';
export const name = 'App Design Summary';
export const level = 0;

export const Readme: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frontier Tower Maps</h1>
      <p className="text-lg mb-4">
        This is a vibe-coded prototype of an interactive map application for Frontier Tower.
        Select a floor on the left side to see a map.
        Search by room name or room id to find a given floor.
        Schematics of the floors are 99% accurate to real blueprints of the Tower.
      </p>
      <p className="text-lg mb-4">
        To add a new room, you'll need to provide info in the form of
        <code>
          <ul>
            <li>"id": "f17r1"</li>
            <li>"name": "BBQ"</li>
            <li>"floorId": "17"</li>
            <li>"notes": "BBQ & Rave"</li>
            <li>"color": "rgba(255, 200, 255, .5)"</li>
            <li>"coords": [5, 56, 10,10]</li>
          </ul>
        </code>
      </p>
      <p className="text-lg mb-4">
        Contact <a href="http://t.me/SxP256" className='text-blue-500 underline'>Sameer</a> on Telegram or join the <b>VR/AR & Digital Twin</b> channel for more info.
      </p>
    </div>
  );
};
