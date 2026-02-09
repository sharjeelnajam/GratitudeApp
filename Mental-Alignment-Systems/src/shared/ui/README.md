# Shared UI Components

Reusable UI primitives that are calm, grounded, and non-demanding.

## Principles

- **Theme-driven** - No hardcoded colors, all styling from theme
- **Soft & Grounded** - Gentle, non-aggressive styling
- **Non-demanding** - Subtle presence, no urgency
- **Subtle Animations** - Slow, contemplative motion only

## Components

### Container

A soft, grounded container for content.

```typescript
import { Container } from '@/shared/ui';

<Container padding="md" backgroundColor="surface">
  <Text>Content here</Text>
</Container>
```

**Props:**
- `padding` - 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `backgroundColor` - 'background' | 'surface' | 'surfaceElevated' (default: 'background')
- `style` - Additional ViewStyle

### Text

Soft, readable text with theme support and typography variants.

```typescript
import { Text } from '@/shared/ui';

<Text variant="h1" color="primary">
  Heading
</Text>

<Text variant="contemplative" color="secondary">
  A moment of reflection
</Text>
```

**Props:**
- `variant` - 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'bodySmall' | 'contemplative' | 'caption' | 'label' (default: 'body')
- `color` - 'primary' | 'secondary' | 'tertiary' | 'inverse' (default: 'primary')
- `style` - Additional TextStyle
- All standard TextProps

### Button

Gentle, non-urgent button. Soft, grounded, non-demanding.

```typescript
import { Button } from '@/shared/ui';

<Button variant="primary" size="md">
  Continue
</Button>

<Button variant="subtle" size="sm">
  Cancel
</Button>
```

**Props:**
- `variant` - 'primary' | 'secondary' | 'subtle' | 'text' (default: 'primary')
- `size` - 'sm' | 'md' | 'lg' (default: 'md')
- `loading` - boolean (default: false)
- `disabled` - boolean
- `style` - Additional ViewStyle
- `textStyle` - Additional TextStyle
- All standard TouchableOpacityProps

**Variants:**
- `primary` - Accent color background, inverse text
- `secondary` - Transparent with border
- `subtle` - Surface background
- `text` - Transparent, accent text

### Card

Soft, grounded card container with gentle elevation.

```typescript
import { Card } from '@/shared/ui';

<Card variant="default" padding="lg">
  <Text>Card content</Text>
</Card>
```

**Props:**
- `variant` - 'default' | 'elevated' | 'subtle' (default: 'default')
- `padding` - 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `style` - Additional ViewStyle

**Variants:**
- `default` - Surface background with border
- `elevated` - Elevated surface with subtle shadow
- `subtle` - Surface background, no border

### FadeInView

Gentle fade-in animation. Slow, subtle, contemplative entrance.

```typescript
import { FadeInView } from '@/shared/ui';

<FadeInView duration={500} delay={100}>
  <Text>This fades in gently</Text>
</FadeInView>
```

**Props:**
- `duration` - number (optional, uses theme default if not provided)
- `delay` - number (default: 0)
- `fadeIn` - boolean (default: true, set to false to disable)
- `style` - Additional ViewStyle

### AmbientBackground

Soft, ambient background that adapts to room themes.

```typescript
import { AmbientBackground } from '@/shared/ui';

<AmbientBackground variant="solid" roomTheme>
  <Text>Content with ambient background</Text>
</AmbientBackground>
```

**Props:**
- `variant` - 'solid' | 'gradient' | 'subtle' (default: 'solid')
- `roomTheme` - boolean (default: false, uses room theme colors if true)
- `style` - Additional ViewStyle

**Note:** Gradient variant requires `expo-linear-gradient` package (can be added later).

## Usage Examples

### Basic Layout

```typescript
import { AmbientBackground, Container, Text, Card } from '@/shared/ui';

function MyScreen() {
  return (
    <AmbientBackground variant="solid">
      <Container padding="lg">
        <Card variant="elevated" padding="md">
          <Text variant="h2">Welcome</Text>
          <Text variant="body" color="secondary">
            A calm, reverent space
          </Text>
        </Card>
      </Container>
    </AmbientBackground>
  );
}
```

### Animated Entry

```typescript
import { FadeInView, Card, Text } from '@/shared/ui';

function AnimatedCard() {
  return (
    <FadeInView duration={500} delay={200}>
      <Card variant="default">
        <Text variant="contemplative">
          This card fades in gently
        </Text>
      </Card>
    </FadeInView>
  );
}
```

### Button Actions

```typescript
import { Button, Container } from '@/shared/ui';

function Actions() {
  return (
    <Container>
      <Button variant="primary" onPress={handleContinue}>
        Continue
      </Button>
      <Button variant="subtle" onPress={handleCancel}>
        Cancel
      </Button>
    </Container>
  );
}
```

## Design Philosophy Compliance

✅ **No hardcoded colors** - All colors from theme  
✅ **Subtle animations** - Slow, contemplative motion  
✅ **Soft & grounded** - Gentle styling, no aggression  
✅ **Non-demanding** - Calm presence, no urgency  
✅ **Theme-driven** - Fully integrated with design system  

## Styling Guidelines

1. **Always use theme colors** - Never hardcode colors
2. **Use semantic spacing** - Use `spacingSemantic` values
3. **Prefer subtle variants** - Choose 'subtle' over 'primary' when appropriate
4. **Slow animations** - Use theme motion durations
5. **Gentle feedback** - Use `activeOpacity={0.7}` for touch feedback

## Extending Components

When creating new components:

1. Import `useTheme` from `@/theme`
2. Use theme colors, spacing, typography, and motion tokens
3. Keep styling soft and grounded
4. Avoid aggressive or urgent styling
5. Support both light and dark modes
6. Make components accessible
