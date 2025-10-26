import LoginForm from '@/features/auth/login-form';
import { requireNotAuth } from '@/lib/auth-utils';

export default async function Login() {
  await requireNotAuth();

  return (
    <div>
      <LoginForm />
    </div>
  );
}
