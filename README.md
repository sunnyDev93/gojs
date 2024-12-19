# Interactive Network Diagram

A React application built with TypeScript and GoJS that visualizes network relationships with interactive node connections and expandable/collapsible links.

## Features

- Interactive node-link diagram visualization
- Expandable/collapsible link groups
- Tooltip information on hover
- Clear relationship paths with orthogonal routing
- Multiple relationship support between nodes
- Automatic layout organization

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Diagram.tsx         # Main diagram component
│   ├── hooks/
│   │   ├── useDebounce.ts     # Debounce hook for optimization
│   │   └── useGojsDiagram.ts  # GoJS diagram initialization
│   ├── styles/
│   │   └── diagram.css        # Diagram styling
│   ├── utils/
│   │   └── generateData.ts    # Data generation utility
│   ├── App.tsx               # Root component
│   └── main.tsx             # Entry point
└── vite.config.ts           # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sunnyDev93/gojs
cd gojs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

### Basic Interactions

- **View Connections**: Lines between nodes show relationships
- **Multiple Links**: 
  - Collapsed: Blue circle with number shows grouped relationships
  - Expanded: Individual links with labels (A, B, C, etc.)
- **Expand/Collapse**: Double-click blue circle to toggle view
- **Tooltips**: Hover over nodes for additional information

### Link Behavior

- Links automatically route to avoid overlapping
- Maximum of 6 visible links when expanded
- Labels align vertically for better readability
- Clear visual distinction between relationships

## Technical Details

### Key Components

#### Diagram Component
```typescript
const Diagram: React.FC = () => {
  const model = generateData();
  const diagramRef = useGojsDiagram(model);
  
  return <div ref={diagramRef} className="diagram-container" />;
};
```

#### Data Structure
```typescript
interface NodeData {
  key: string;
  text: string;
}

interface LinkData {
  from: string;
  to: string;
  text: string;
  count?: number;
  links?: { text: string }[];
}
```

### Styling

Customize appearance in `diagram.css`:
```css
.diagram-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.go-tooltip {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-radius: 4px;
}
```

### Layout Configuration

Adjust diagram layout in `useGojsDiagram.ts`:
```typescript
layout: $(go.LayeredDigraphLayout, {
  direction: 0,
  layerSpacing: 150,
  columnSpacing: 50,
  setsPortSpots: false,
  packOption: go.LayeredDigraphLayout.PackStraighten
})
```

## Development

### Building for Production
```bash
npm run build
# or
yarn build
```

### Running Development Server
```bash
npm run dev
# or
yarn dev
```

## Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [GoJS](https://gojs.net/) - Diagram Library
- [Vite](https://vitejs.dev/) - Build Tool

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GoJS for providing the diagramming library
- React team for the excellent UI framework
- Vite team for the fast build tool