# **App Name**: FloorFinder

## Core Features:

- Floor Selector: Floor selection via a list of available floors, e.g. Basement, 1, 2, ..., Roof.
- SVG Map Display: Display SVG map corresponding to selected floor.
- Config Loading: Loading semantic information from config.json.
- Room Search: Search for rooms by name or ID, and highlight matches. If only a single result is matched in the room, enter switches floors and highlights the room.
- Zoom and Pan: Pan and zoom functionality for the SVG map to view in more detail.
- Generative Space Name Enhancement: Generative AI powered tool: Using room names, offer contextual information on what that space may be useful for or who it might be useful to reach. Use of this tool is left up to the discretion of the LLM based on whether it determines that more useful results can be generated than just a space name, if any such determination can be made.

## Style Guidelines:

- Primary color: Soft blue (#A8D0E6) to mimic architectural blueprints.
- Background color: Off-white (#F0F0F0) resembling paper.
- Accent color: Orange (#FFB347) for interactive elements such as search results and highlight floor plan regions.
- Body and headline font: 'PT Sans' (sans-serif) provides a modern look while being clear to read. Paired with 'Playfair' (serif) for headings
- Note: currently only Google Fonts are supported.
- Floors listed on the left, with the map occupying the majority of the screen space.
- Smooth transitions between floors. A brief zoom when switching between floor numbers. Immediate room highlighting on selecting a room name from the room search bar.