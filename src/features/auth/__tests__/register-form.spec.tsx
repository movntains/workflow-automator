// biome-ignore-all lint/suspicious/noExplicitAny: `any` is used solely for test mock purposes

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient } from '@/lib/auth-client';
import RegisterForm from '../register-form';

vi.mock('next/navigation', () => {
  const actual = vi.importActual('next/navigation');

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@/lib/auth-client', () => {
  const actual = vi.importActual('@/lib/auth-client');

  return {
    authClient: {
      ...actual,
      signUp: {
        email: vi.fn(),
      },
    },
  };
});

describe('RegisterForm Component', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('renders the register form', () => {
    render(<RegisterForm />);

    expect(screen.findByText('Get Started')).toBeDefined();
  });

  it('returns error messages if the form submission is not valid', async () => {
    render(<RegisterForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText('Please enter a valid email address.')).not.toBeNull();
    expect(screen.getByText('Password is required.')).not.toBeNull();
  });

  it('handles a valid form submission', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(authClient.signUp.email).toHaveBeenCalledWith(
      {
        name: 'test@example.com',
        email: 'test@example.com',
        password: 'password',
        callbackURL: '/',
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it('redirects upon successful login', async () => {
    const mockPush = vi.fn();

    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);

    vi.mocked(authClient.signUp.email).mockImplementationOnce((_, callbacks) => {
      callbacks?.onSuccess?.(undefined as any);

      return Promise.resolve();
    });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays an error toast if login fails', async () => {
    const errorMessage = 'Invalid credentials';

    vi.mocked(authClient.signUp.email).mockImplementationOnce((_, callbacks) => {
      callbacks?.onError?.({
        error: { message: errorMessage },
      } as any);

      return Promise.resolve();
    });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'already_exists@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
