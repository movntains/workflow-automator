import { requireAuth } from '@/lib/auth-utils';
import { caller } from '@/trpc/server';

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="flex flex-col gap-6">
      Protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
