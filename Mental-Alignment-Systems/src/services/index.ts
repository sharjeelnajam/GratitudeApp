/**
 * Services Layer
 * 
 * External integrations and service abstractions:
 * - AI services
 * - Content services
 * - Audio services
 * - Notification services
 * - Storage services
 */

// Service interfaces and implementations will be added here
// Each service should be in its own file:
// - services/ai/
// - services/content/
// - services/audio/
// - services/notifications/
// - services/storage/

export interface ServiceError {
  message: string;
  code?: string;
}

// Base service interface
export interface BaseService {
  initialize(): Promise<void>;
  cleanup?(): Promise<void>;
}
