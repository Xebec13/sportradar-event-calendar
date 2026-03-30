import eventsData from '@/data/events.json';
import type { SportEvent } from '@/lib/types';

const STORAGE_KEY = 'sportradar-events'; // single key for all event data — avoids collisions with other localStorage entries

// Reads from localStorage; falls back to seed data if empty, non-array, or JSON parse error
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

// Serializes the full events array — always replaces, never appends
export function saveEvents(events: SportEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
