# Design System

Complete design system foundation for a sacred, calming experience.

## Principles

- **Sacred & Calm** - No bright or gamified colors
- **Slow & Subtle** - No aggressive animations
- **Dark-Mode First** - Designed for dark mode by default
- **Room Themes** - Supports Fireplace, Ocean, Forest, Night Sky environments

## Structure

```
src/theme/
├── colors.ts          # Color tokens (neutral, warm, grounding, accent)
├── typography.ts      # Typography scale (soft, readable)
├── spacing.ts         # Spacing system (4px base unit)
├── motion.ts          # Motion tokens (slow, subtle)
├── roomThemes.ts      # Room-specific theme configurations
├── theme.ts           # Main theme configuration
├── ThemeProvider.tsx  # React context provider
└── index.ts           # Exports
```

## Usage

### Basic Theme Access

```typescript
import { useTheme } from '@/theme';

function MyComponent() {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Hello
      </Text>
    </View>
  );
}
```

### Colors

```typescript
import { useTheme } from '@/theme';
import { neutral, warm, grounding, accent } from '@/theme/colors';

const { theme } = useTheme();

// Semantic colors (recommended)
theme.colors.background
theme.colors.surface
theme.colors.text.primary
theme.colors.accent

// Direct color tokens
neutral.light[500]
warm.dark[400]
grounding.light[600]
accent.light[500]
```

### Typography

```typescript
import { useTheme } from '@/theme';

const { theme } = useTheme();

// Pre-defined text styles
theme.textStyles.h1
theme.textStyles.body
theme.textStyles.contemplative

// Direct typography tokens
theme.typography.fontSize.base
theme.typography.fontWeight.normal
theme.typography.lineHeight.normal
```

### Spacing

```typescript
import { useTheme } from '@/theme';

const { theme } = useTheme();

// Semantic spacing (recommended)
theme.spacingSemantic.md        // 16px
theme.spacingSemantic.container // 16px
theme.spacingSemantic.card      // 24px

// Direct spacing tokens
theme.spacing[4]  // 16px
theme.spacing[6]  // 24px
theme.spacing[8]  // 32px
```

### Motion

```typescript
import { useTheme } from '@/theme';

const { theme } = useTheme();

// Pre-defined animations
theme.motion.animations.fadeIn
theme.motion.animations.slideUp
theme.motion.animations.cardEnter

// Direct motion tokens
theme.motion.duration.normal  // 300ms
theme.motion.duration.slow    // 500ms
theme.motion.easing.easeOut   // cubic-bezier
```

### Room Themes

```typescript
import { useTheme } from '@/theme';
import { getRoomTheme, RoomThemeId } from '@/theme/roomThemes';

const { setRoomTheme, roomThemeId } = useTheme();

// Set a room theme
setRoomTheme('fireplace');  // Warm, cozy
setRoomTheme('ocean');      // Calm, serene
setRoomTheme('forest');     // Grounding, natural
setRoomTheme('nightSky');   // Deep, contemplative

// Get room theme details
const roomTheme = getRoomTheme('fireplace');
```

## Color System

### Neutral Colors
Soft, grounding neutrals that form the foundation. Available in 11 shades (50-950) for both light and dark modes.

### Warm Colors
Gentle, comforting warm tones (not bright or energetic). Muted oranges and ambers.

### Grounding Colors
Earthy, stable tones that provide foundation. Muted browns and earth tones.

### Accent Colors
Subtle, reverent accents. Purple/indigo tones that are calm, not bright.

### Semantic Colors
Pre-defined colors for UI purposes:
- `background` - Main background
- `surface` - Card/surface background
- `text.primary` - Primary text
- `text.secondary` - Secondary text
- `text.tertiary` - Tertiary text
- `border` - Border color
- `accent` - Accent color

## Typography System

### Font Families
- `sans` - System sans-serif (default)
- `serif` - System serif (for contemplative text)
- `mono` - System monospace (rarely used)

### Font Sizes
Scale from `xs` (12px) to `5xl` (48px). Base size is 16px for comfortable reading.

### Font Weights
Soft weights: `light` (300), `normal` (400), `medium` (500), `semibold` (600), `bold` (700). Avoid heavy weights for calm feel.

### Text Styles
Pre-defined styles:
- `display` - Rarely used, for special moments
- `h1`, `h2`, `h3`, `h4` - Headings
- `body`, `bodyLarge`, `bodySmall` - Body text
- `contemplative` - For reflections and moments (generous spacing)
- `caption`, `label` - Small text

## Spacing System

Based on 4px base unit. Semantic names available:
- `xs` (4px) - Very tight
- `sm` (8px) - Tight
- `md` (16px) - Base
- `lg` (24px) - Generous
- `xl` (32px) - Large

Semantic spacing:
- `container` - Container padding
- `card` - Card padding
- `section` - Section spacing
- `gapNormal` - Normal gap between items

## Motion System

### Duration
Slow, contemplative timing:
- `fast` (150ms) - Quick interactions
- `normal` (300ms) - Standard transitions
- `slow` (500ms) - Contemplative transitions
- `slower` (750ms) - Page transitions
- `slowest` (1000ms) - Rarely used

### Easing
Gentle, natural easing curves:
- `easeOut` - Gentle ease out (default)
- `easeInOut` - Smooth transition
- `soft` - Very gentle curve

### Animations
Pre-defined animations:
- `fadeIn`, `fadeOut` - Gentle appearance
- `slideUp`, `slideDown` - Subtle movement
- `cardEnter` - Card appearance
- `pageTransition` - Page transitions

**No aggressive animations** - All animations are slow and subtle.

## Room Themes

### Fireplace
Warm, cozy, amber tones. Like sitting by a fire.

### Ocean
Calm, serene, blue-green tones. Like being by the ocean.

### Forest
Grounding, natural, green-brown tones. Like being in a forest.

### Night Sky
Deep, contemplative, indigo-purple tones. Like looking at the night sky.

### Default
Base calm, reverent theme with purple accents.

## Design Philosophy Compliance

✅ **No bright colors** - All colors are muted and calm  
✅ **No gamified colors** - No energetic or competitive tones  
✅ **No aggressive animations** - All motion is slow and subtle  
✅ **Dark-mode friendly** - Designed for dark mode by default  
✅ **Sacred & reverent** - Calm, peaceful, contemplative  

## Examples

### Card Component

```typescript
import { useTheme } from '@/theme';
import { View, Text, StyleSheet } from 'react-native';

function Card({ children }) {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.surface,
        padding: theme.spacingSemantic.card,
        borderRadius: theme.borderRadius.lg,
        borderWidth: theme.borderWidth[1],
        borderColor: theme.colors.border,
      }
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Additional styles
  },
});
```

### Contemplative Text

```typescript
import { useTheme } from '@/theme';
import { Text } from 'react-native';

function ContemplativeText({ children }) {
  const { theme } = useTheme();
  const textStyle = theme.textStyles.contemplative;
  
  return (
    <Text style={{
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      lineHeight: textStyle.lineHeight,
      letterSpacing: textStyle.letterSpacing,
      color: theme.colors.text.primary,
    }}>
      {children}
    </Text>
  );
}
```
