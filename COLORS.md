# Goatcast Web - Color Palette

The color palette has been synchronized from the Goatcast iOS mobile app to ensure visual consistency across all platforms.

## Color Reference

### Primary Accents
- **Dark Orange** (`#FF4F00`) - Primary action and highlights
- **Dark Purple** (`#4D08A4`) - Secondary action and emphasis
- **Light Orange** (`#F97316`) - Tertiary action and additional emphasis

### Semantic Colors

#### Background
- **Dark Mode**: `#121212`
- **Light Mode**: `#FAFAFA`

#### Base (Text/Content)
- **Dark Mode**: `#000000` (Black)
- **Light Mode**: `#FFFFFF` (White)

#### Border
- **Dark Mode**: `#1E1E1E`
- **Light Mode**: `#F3F3F3`

#### Highlight (Emphasized elements)
- **Dark Mode**: `#242424`
- **Light Mode**: `#EEF0F4`

#### Hover (Interactive state)
- **Dark Mode**: `#090909`
- **Light Mode**: `#FBFBFB`

#### Muted (Secondary text)
- **Dark Mode**: `#727272`
- **Light Mode**: `#848484`

#### Subtitle (Tertiary text)
- **Dark Mode**: `#ACACAC`
- **Light Mode**: `#4B4744`

#### Title (Headings)
- **Dark Mode**: `#FFFFFF`
- **Light Mode**: `#0F1414`

## Usage in Components

### Using Tailwind Classes
```jsx
<div className="bg-goatcast-background text-goatcast-title">
  <h1 className="text-goatcast-title font-bold">Hello</h1>
  <p className="text-goatcast-muted">Secondary text</p>
  <button className="bg-goatcast-darkOrange text-white">
    Action Button
  </button>
</div>
```

### Using the Color Utility
```jsx
import { getColor, colors } from './config/colors'

// Get color for specific theme
const bgColor = getColor('background', 'dark')
const textColor = colors.title.dark

// Use in inline styles
<div style={{ color: getColor('title', 'dark') }}>
  Colored text
</div>
```

## How Colors Were Integrated

1. **Tailwind Config** - Extended with all Goatcast colors in `tailwind.config.js`
   - All colors available as `bg-goatcast-*`, `text-goatcast-*`, `border-goatcast-*`, etc.

2. **Colors Utility File** - Created `src/config/colors.js`
   - Centralized color management
   - Theme-aware color functions
   - CSS variable generation

3. **Source** - Converted from iOS color sets
   - Location: `/Users/hoangnguyenvu/Downloads/goatcast/goatcast-app/goatcast/Resourses/Assets.xcassets/Color/`
   - Maintains exact same color values across platforms

## Light/Dark Mode Support

Colors automatically adapt based on theme:

```jsx
// Theme-aware color
const bgColor = getColor('background', isDarkMode ? 'dark' : 'light')

// Or use CSS variables for auto theme switching
const cssVars = getCSSVariables(isDarkMode ? 'dark' : 'light')
```

## Migration Notes

The current app uses a gray-based palette. The Goatcast branded colors provide:
- Better brand consistency
- Enhanced visual hierarchy with accent colors (Orange & Purple)
- Improved accessibility with proper contrast ratios
- Platform-wide consistency with iOS app

## Future Updates

To update these colors:
1. Modify the iOS color sets in the mobile app
2. Update `tailwind.config.js` with new values
3. Update `src/config/colors.js` with corresponding hex values
4. All components will automatically reflect the changes

