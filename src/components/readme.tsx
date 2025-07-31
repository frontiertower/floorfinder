import { CommonUpper } from './blueprints/common-upper';

export const id = 'readme';
export const name = 'App Design Summary';
export const level = 0;

export const Readme: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">App Design Summary</h1>
      <p className="text-lg mb-4">
        This application is designed to help users navigate different floors and rooms within a building. It utilizes React for the frontend, with a focus on reusable components located in the <code>src/components/</code> directory. Key components include:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><code>FloorFinder</code>: The main component responsible for managing floor selection and room highlighting.</li>
        <li><code>FloorPlan</code>: Renders the SVG plan for the currently selected floor.</li>
        <li><code>InfoBox</code>: Displays information about a selected or hovered room.</li>
        <li>Floor SVG components (e.g., <code>floor-1.tsx</code>, <code>floor-2.tsx</code>): Each of these components renders the SVG for a specific floor and contains interactive <code>Room</code> components.</li>
      </ul>
      <p className="text-lg mb-4">
        The application uses URL hashcodes to deep link to specific floors. When no hashcode is present, it defaults to displaying floor 2 (or the Readme component, as we are modifying it). Static assets, including the configuration file for floor and room data (<code>config.json</code>), are stored in the <code>public/</code> directory.
      </p>
      <p className="text-lg">
        Genkit-related code, such as AI flows for enhancing space names, is located in the <code>src/ai/</code> directory.
      </p>
    </div>
  );
};
