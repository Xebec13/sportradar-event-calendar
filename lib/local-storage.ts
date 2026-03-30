import eventsData from '@/data/events.json';
import type { SportEvent } from '@/lib/types';

const STORAGE_KEY = 'sportradar-events';

export function loadEvents(): SportEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return eventsData.data as SportEvent[];
    const parsed = JSON.parse(raw) as SportEvent[];
    if (!Array.isArray(parsed)) return eventsData.data as SportEvent[];
    return parsed;
  } catch {
    return eventsData.data as SportEvent[];
  }
}

export function saveEvents(events: SportEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
