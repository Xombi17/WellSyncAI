import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const {
  pushMock,
  loginDemoMock,
  loginWithTokenMock,
  setStoreLangMock,
  signInWithPasswordMock,
  fetchMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  loginDemoMock: vi.fn(),
  loginWithTokenMock: vi.fn(),
  setStoreLangMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  fetchMock: vi.fn(),
}));

vi.stubGlobal('fetch', fetchMock);

function mockJsonResponse(body: unknown, ok = true, status = 200, statusText = 'OK') {
  return {
    ok,
    status,
    statusText,
    json: async () => body,
  } as Response;
}

function asFormBody(body?: BodyInit | null) {
  if (typeof body !== 'string') return '';
  return new URLSearchParams(body);
}

function matchesBackendLogin(input: RequestInfo | URL) {
  return typeof input === 'string' && input.endsWith('/api/v1/login');
}

fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
  if (!matchesBackendLogin(input)) {
    throw new Error(`Unexpected fetch call: ${String(input)}`);
  }

  const params = asFormBody(init?.body);
  const username = params.get('username');
  const password = params.get('password');

  if (username === 'sharma' && password === 'demo1234') {
    return mockJsonResponse({
      access_token: 'backend-token',
      token_type: 'bearer',
      household_id: 'sharma-household-id',
    });
  }

  return mockJsonResponse({ detail: 'Incorrect username or password' }, false, 401, 'Unauthorized');
});


vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
}));

vi.mock('@/components/VoiceWaveform', () => ({
  default: () => <div data-testid="voice-waveform" />,
}));

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({
    loginDemo: loginDemoMock,
    loginWithToken: loginWithTokenMock,
    setLanguage: setStoreLangMock,
  }),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: signInWithPasswordMock,
    },
  },
}));

import LoginPage from '@/views/LoginPage';
import { authApi } from '@/lib/api';

describe('login flow regression coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not silently enter demo mode when normal sign-in fails in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.endsWith('/api/v1/auth/sync')) {
        return mockJsonResponse({ status: 'success', synced: 0, created: 0, total_auth_users: 0 });
      }
      return mockJsonResponse({ detail: 'Incorrect username or password' }, false, 401, 'Unauthorized');
    });

    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    fireEvent.change(screen.getByPlaceholderText(/sharma or you@example.com/i), {
      target: { value: 'sharma' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'demo1234' },
    });
    fireEvent.submit(screen.getAllByRole('button', { name: /^sign in$/i })[1].closest('form')!);

    await waitFor(() => {
      expect(loginDemoMock).not.toHaveBeenCalled();
    });

    expect(loginWithTokenMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalledWith('/dashboard');
    expect(await screen.findByText(/authentication failed|invalid login credentials|incorrect username or password/i)).toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it('authApi.login should use Supabase auth for all logins', async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: { id: 'supabase-user-123' },
        session: { access_token: 'supabase-access-token' }
      },
      error: null,
    });

    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === 'string' && input.endsWith('/api/v1/auth/sync')) {
        return mockJsonResponse({ status: 'success', synced: 1, created: 0, total_auth_users: 1 });
      }
      throw new Error(`Unexpected fetch call: ${String(input)}`);
    });

    await expect(authApi.login('sharma', 'demo1234')).resolves.toEqual({
      access_token: 'supabase-access-token',
      token_type: 'bearer',
      household_id: 'supabase-user-123',
    });
  });
});
