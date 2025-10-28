import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '../auth';
import { requireAuth, requireNotAuth } from '../auth-utils';

vi.mock('next/headers', () => {
  const actual = vi.importActual('next/headers');

  return {
    ...actual,
    headers: vi.fn(),
  };
});

vi.mock('next/navigation', () => {
  const actual = vi.importActual('next/navigation');

  return {
    ...actual,
    redirect: vi.fn(),
  };
});

describe('Auth Utils', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('redirects to the login page if authentication is required and the user is not authenticated', async () => {
    const getSessionSpy = vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => null),
    }));

    await requireAuth();

    expect(getSessionSpy).toHaveBeenCalled();

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('returns the current session if authentication is required and the user is authenticated', async () => {
    const getSessionSpy = vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => ({ userId: 1 })),
    }));

    const result = await requireAuth();

    expect(getSessionSpy).toHaveBeenCalled();

    expect(redirect).not.toHaveBeenCalled();

    expect(result).toStrictEqual({ userId: 1 });
  });

  it('redirects to the home page if the user is authenticated but access requires that the user is not authenticated', async () => {
    const getSessionSpy = vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => ({ userId: 1 })),
    }));

    await requireNotAuth();

    expect(getSessionSpy).toHaveBeenCalled();

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('does not redirect to the home page if the user is not authenticated and access requires that the user is not authenticated', async () => {
    const getSessionSpy = vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => null),
    }));

    await requireNotAuth();

    expect(getSessionSpy).toHaveBeenCalled();

    expect(redirect).not.toHaveBeenCalled();
  });
});
