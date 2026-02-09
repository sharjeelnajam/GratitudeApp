/**
 * Shared UI Components
 * 
 * Reusable UI components used across features.
 * These should be generic and not contain business logic.
 * 
 * All components are:
 * - Theme-driven (no hardcoded colors)
 * - Soft and grounded
 * - Non-demanding
 * - Subtle animations only
 */

export { Container } from './Container';
export type { ContainerProps } from './Container';

export { Text } from './Text';
export type { TextProps } from './Text';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { FadeInView } from './FadeInView';
export type { FadeInViewProps } from './FadeInView';

export { PulseView } from './PulseView';
export type { PulseViewProps } from './PulseView';

export { AmbientBackground } from './AmbientBackground';
export type { AmbientBackgroundProps } from './AmbientBackground';

export { Header } from './Header';
export type { HeaderProps } from './Header';

export { UserHeader } from './UserHeader';
