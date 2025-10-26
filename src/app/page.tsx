'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function Home() {
  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col gap-6">
      {JSON.stringify(data)}

      {data && (
        <Button
          onClick={() => {
            authClient.signOut();
          }}
        >
          Log Out
        </Button>
      )}
    </div>
  );
}
