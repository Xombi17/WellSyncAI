import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAuthState,
  setAuthTokens,
  clearAuthTokens,
  getToken,
  getHouseholdId,
  isAuthenticated,
  decodeToken,
  isTokenExpired,
} from '@/lib/auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setAuthTokens and getAuthState', () => {
    it('should set and retrieve auth tokens', () => {
      const token = 'test-token-123';
      const householdId = 'household-456';

      setAuthTokens(token, householdId);

      const state = getAuthState();
      expect(state.token).toBe(token);
      expect(state.householdId).toBe(householdId);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should return unauthenticated state when no tokens', () => {
      const state = getAuthState();
      expect(state.token).toBeNull();
      expect(state.householdId).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearAuthTokens', () => {
    it('should clear all auth tokens', () => {
      setAuthTokens('token', 'household-id');
      clearAuthTokens();

      const state = getAuthState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('getToken and getHouseholdId', () => {
    it('should retrieve individual tokens', () => {
      setAuthTokens('my-token', 'my-household');

      expect(getToken()).toBe('my-token');
      expect(getHouseholdId()).toBe('my-household');
    });

    it('should return null when tokens not set', () => {
      expect(getToken()).toBeNull();
      expect(getHouseholdId()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', () => {
      setAuthTokens('token', 'household-id');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when not authenticated', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('decodeToken', () => {
    it('should decode valid JWT token', () => {
      // Create a simple JWT token (header.payload.signature)
      const payload = { sub: 'user-123', exp: Math.floor(Date.now() / 1000) + 3600 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const decoded = decodeToken(token);
      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      expect(decodeToken('invalid-token')).toBeNull();
      expect(decodeToken('only.two')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = { exp: futureExp };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = { exp: pastExp };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
    });
  });
});
