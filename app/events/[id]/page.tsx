import { notFound } from 'next/navigation';
import eventsData from '@/data/events.json';
import { Event } from '@/components/events';
import type { SportEvent } from '@/lib/types';

/**
 * EventPage — server component for the /events/[id] route.
 *
 * Resolves the event by id from the static JSON seed and renders Event.
 * params is a Promise in Next.js 16 — must be awaited before accessing id.
 * notFound() triggers the nearest not-found.tsx boundary when id has no match.
 */
interface Props {
  params: Promise<{ id: string }>;
}

const allEvents = eventsData.data as SportEvent[];

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = allEvents.find((e) => e.id === id);

  if (!event) notFound();

  return <Event event={event} />;
}
