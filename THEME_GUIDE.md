# Goatcast Theme System Guide

## Overview

Goatcast now supports both **dark mode** and **light mode** with seamless switching and persistent user preferences.

## How It Works

### Theme Detection
The app detects user preference in this order:
1. **Saved preference** - Stored in `localStorage` as `goatcast-theme`
2. **System preference** - Uses `prefers-color-scheme` media query
3. **Default** - Falls back to dark mode

### Theme Switching
Users can toggle the theme using the sun/moon icon (☀️/🌙) in the top-right corner of the app.

## Architecture

### 1. **Theme Context** (`src/context/ThemeContext.jsx`)
- Provides theme state and toggle function
- Manages localStorage persistence
- Updates HTML class for Tailwind dark mode
- Available via `useTheme()` hook

### 2. **Theme Toggle Component** (`src/components/ThemeToggle.jsx`)
- Visual toggle button with sun/moon emoji
- Uses `useTheme()` hook internally
- Accessible with proper ARIA labels

### 3. **Tailwind Configuration**
- Uses `darkMode: 'class'` for class-based dark mode
- All colors have light and dark variants
- Defined in `tailwind.config.js`

### 4. **CSS Variables** (`src/index.css`)
- CSS custom properties for theme colors
- Smooth transitions when theme changes
- Supports dynamic color switching

## Color Palette by Theme

### Dark Mode (Default)
```
Background:   #121212
Base:         #000000
Border:       #1E1E1E
Highlight:    #242424
Hover:        #090909
Muted:        #727272
Subtitle:     #ACACAC
Title:        #FFFFFF
```

### Light Mode
```
Background:   #FAFAFA
Base:         #FFFFFF
Border:       #F3F3F3
Highlight:    #EEF0F4
Hover:        #FBFBFB
Muted:        #848484
Subtitle:     #4B4744
Title:        #0F1414
```

### Accent Colors (Both Modes)
```
Dark Orange:  #FF4F00
Light Orange: #F97316
Dark Purple:  #4D08A4
```

## Usage in Components

### Using `useTheme()` Hook
```jsx
import { useTheme } from '../context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  )
}
```

### Using Tailwind Classes
```jsx
// Automatically applies based on theme
<div className="bg-goatcast-background text-goatcast-title">
  <!-- In dark mode: #121212 background, #FFFFFF text -->
  <!-- In light mode: #FAFAFA background, #0F1414 text -->
</div>

// Light-mode specific
<div className="dark:bg-goatcast-background light:bg-white">
  <!-- Dark: goatcast color, Light: white -->
</div>
```

### Using Color Utility Functions
```jsx
import { getColor } from './config/colors'
import { useTheme } from './context/ThemeContext'

function MyComponent() {
  const { theme } = useTheme()
  const bgColor = getColor('background', theme)

  return <div style={{ backgroundColor: bgColor }}>Content</div>
}
```

## Styling Guidelines

### Best Practices

1. **Use Tailwind Classes First**
   ```jsx
   // ✅ Good
   <div className="bg-goatcast-background text-goatcast-title">
   
   // ❌ Avoid
   <div style={{ backgroundColor: getColor('background', theme) }}>
   ```

2. **Semantic Color Names**
   ```jsx
   // ✅ Good - semantic meaning
   <button className="bg-goatcast-darkOrange text-white">
   
   // ❌ Avoid - no context
   <button className="bg-orange-500">
   ```

3. **Consistent with Theme**
   ```jsx
   // ✅ Good - uses theme-aware colors
   <p className="text-goatcast-muted">Secondary text</p>
   
   // ❌ Avoid - hardcoded color
   <p className="text-gray-500">Secondary text</p>
   ```

## Component Examples

### Login Page (Theme Aware)
```jsx
<div className="min-h-screen bg-goatcast-background flex items-center justify-center">
  <div className="bg-goatcast-highlight border border-goatcast-border rounded-lg p-8">
    <h1 className="text-goatcast-title font-bold">🐐 Goatcast</h1>
    <p className="text-goatcast-muted">Organize your feeds</p>
  </div>
</div>
```

### Button with Theme Support
```jsx
<button className="
  bg-goatcast-darkOrange
  text-white
  px-4 py-2
  rounded-lg
  hover:opacity-90
  transition-opacity
">
  Create Desk
</button>
```

### Text with Color Hierarchy
```jsx
<div>
  <h1 className="text-goatcast-title font-bold">Title</h1>
  <p className="text-goatcast-subTitle">Subtitle</p>
  <p className="text-goatcast-muted">Muted text</p>
</div>
```

## Theme Persistence

### How It Works
1. User toggles theme → Theme saved to localStorage
2. Page reload → App reads localStorage
3. Preference restored automatically

### Storage Key
```
localStorage.getItem('goatcast-theme') // 'dark' or 'light'
```

### Clearing Preferences
```javascript
localStorage.removeItem('goatcast-theme')
// App will use system preference on next load
```

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Supports `prefers-color-scheme` media query
- ✅ localStorage for persistence
- ✅ Smooth CSS transitions

## Troubleshooting

### Theme Not Persisting
- Check if localStorage is enabled
- Clear cache and localStorage if stuck
- Verify `goatcast-theme` key exists

### Colors Looking Wrong
- Ensure `dark` class is on HTML element
- Check Tailwind config has `darkMode: 'class'`
- Verify CSS variables are loading in `src/index.css`

### Flashing Light/Dark Mode
- This is normal on first load
- Can be prevented with a theme script in `index.html`
- Will be optimized in future updates

## Future Enhancements

- [ ] System preference sync option
- [ ] Theme preview before switching
- [ ] Custom theme creation
- [ ] Per-component theme overrides
- [ ] Animation preferences (respects prefers-reduced-motion)

## Related Files

- **Theme Context**: `src/context/ThemeContext.jsx`
- **Theme Toggle**: `src/components/ThemeToggle.jsx`
- **Tailwind Config**: `tailwind.config.js`
- **Color Utilities**: `src/config/colors.js`
- **CSS Variables**: `src/index.css`
- **Color Guide**: `COLORS.md`

