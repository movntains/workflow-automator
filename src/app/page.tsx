import { caller } from '@/trpc/server';

export default async function Home() {
  const greeting = await caller.hello({
    text: 'world',
  });

  return (
    <div>
      <h1>{greeting.greeting}</h1>
    </div>
  );
}
