import RegisterForm from '@/features/auth/register-form';
import { requireNotAuth } from '@/lib/auth-utils';

export default async function Register() {
  await requireNotAuth();

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
