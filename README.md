# FloorFinder

FloorFinder is an interactive mapping application designed to help users navigate multi-story buildings. It provides a user-friendly interface to view floor plans, search for specific rooms, and get AI-enhanced information about different spaces.

## Features

- **Interactive Floor Plans**: View and navigate SVG-based maps for each floor of the building.
- **Floor Selection**: Easily switch between different floors like the Basement, numbered floors, and the Roof.
- **Room Search**: Quickly find rooms by their name or ID. The map automatically navigates to and highlights the selected room.
- **Zoom & Pan**: Effortlessly zoom in for details or pan across the map for a better view.
- **AI-Enhanced Room Details**: Get creative and contextual information about what a space can be used for, powered by generative AI.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies**:
    Open a terminal and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    Once the dependencies are installed, start the Next.js development server:
    ```bash
    npm run dev
    ```

3.  **Run the Genkit Development Server**:
    In a separate terminal, start the Genkit development server to enable AI features:
    ```bash
    npm run genkit:dev
    ```

4.  **Open the App**:
    Open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.

## Project Structure

- `src/app/`: Contains the main pages and layout of the application.
- `src/components/`: Houses reusable React components, including UI elements from ShadCN and custom components like `floor-plan.tsx`.
- `src/ai/`: Includes all Genkit-related code, such as AI flows and prompts.
- `public/`: Stores static assets like the `config.json` which contains floor and room data.
- `tailwind.config.ts`: Configuration file for Tailwind CSS.
