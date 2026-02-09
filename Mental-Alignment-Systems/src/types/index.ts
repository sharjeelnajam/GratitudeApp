/**
 * Global Type Definitions
 * 
 * Shared types used across the application.
 */

// Re-export design constraints types
export * from '@/config/design-constraints';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

// Navigation types (will be extended by Expo Router)
export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  alignment: undefined;
  rooms: undefined;
  moments: undefined;
};
