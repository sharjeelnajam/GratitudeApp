/**
 * Moments Feature
 * 
 * Feature module for saved moments and intentions.
 * A quiet memory space - no metrics, no progress tracking.
 * 
 * Structure:
 * - types.ts - Type definitions
 * - momentsManager.ts - Moments management
 * - components/ - Feature-specific UI components (to be added)
 * - hooks/ - Feature-specific hooks (to be added)
 * - services/ - Feature-specific services (to be added)
 */

// Types
export * from './types';
export type {
  SavedMomentEntry,
  SavedIntentionEntry,
  MomentsCollection,
  MomentFilter,
  MomentSortOrder,
} from './types';

// Manager
export * from './momentsManager';
export { MomentsManager, getMomentsManager, resetMomentsManager } from './momentsManager';
