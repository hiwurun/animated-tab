# Animated Tabs

A modern React component library featuring smooth animated tabs with beautiful transitions.

## Features

- Vertical tab navigation with animated indicators
- Smooth transitions between tab content
- Responsive design
- Keyboard accessible
- Custom hover animations
- Built with TypeScript for type safety

## Installation

```bash
# Using npm
npm install
npm run dev

# Using yarn
yarn
yarn dev

# Using pnpm
pnpm install
pnpm dev
```

## Usage

```jsx
import { VerticalTabs } from "./components/VerticalTabs";

function App() {
  const tabs = [
    {
      label: "Dashboard",
      value: "dashboard",
      content: <div>Dashboard Content</div>
    },
    {
      label: "Settings",
      value: "settings",
      content: <div>Settings Content</div>
    },
    {
      label: "Profile",
      value: "profile",
      content: <div>Profile Content</div>
    }
  ];

  return <VerticalTabs tabs={tabs} defaultTabIndex={0} />;
}
```

## Components

### VerticalTabs

A component that displays tabs in a vertical layout with smooth animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Array | - | Array of tab objects with label, value, and content |
| defaultTabIndex | number | 0 | The index of the default selected tab |

## Technologies

- React
- TypeScript
- Framer Motion
- Tailwind CSS
- Vite

## License

MIT
