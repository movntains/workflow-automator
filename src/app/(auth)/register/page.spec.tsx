import { cleanup, render } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '@/lib/auth';
import Register from './page';

vi.mock('next/headers');
vi.mock('next/navigation');

describe('Register Page', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('redirects if the user is authenticated', async () => {
    vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => ({ userId: 1 })),
    }));

    const RegisterResolved = await Register();

    render(RegisterResolved);

    expect(redirect).toHaveBeenCalled();
  });

  it('does not redirect if the user is not authenticated', async () => {
    vi.spyOn(auth, 'api', 'get').mockImplementationOnce(() => ({
      // @ts-expect-error
      getSession: vi.fn(() => null),
    }));

    const RegisterResolved = await Register();

    render(RegisterResolved);

    expect(redirect).not.toHaveBeenCalled();
  });
});
