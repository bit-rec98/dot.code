export interface RateLimitConfig {
  attempts: number;
  lastAttempt: number;
  blockUntil?: number;
}
