import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEvents } from '@/hooks/use-events';
import type { NewEventFormData } from '@/lib/types';

const validFormData: NewEventFormData = {
  homeTeam: 'Real Madrid',
  awayTeam: 'Barcelona',
  dateVenue: '2025-06-15',
  timeVenueUTC: '20:00',
  sport: 'soccer',
  stadium: 'Santiago Bernabéu',
  competitionName: 'La Liga',
};

beforeEach(() => {
  localStorage.clear();
});

describe('useEvents — initialization', () => {
  it('returns events on mount', () => {
    const { result } = renderHook(() => useEvents());
    expect(Array.isArray(result.current.events)).toBe(true);
    expect(result.current.events.length).toBeGreaterThan(0);
  });

  it('loads events from localStorage when present', () => {
    const stored = [{ ...validFormData, id: 'test-event' }];
    localStorage.setItem('sportradar-events', JSON.stringify(stored));
    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toHaveLength(1);
  });

  it('falls back to seed data when localStorage is empty', () => {
    const { result } = renderHook(() => useEvents());
    const { result: resultEmpty } = renderHook(() => useEvents());
    expect(result.current.events.length).toBe(resultEmpty.current.events.length);
  });
});

describe('useEvents — addEvent', () => {
  it('adds a new event to the events list', async () => {
    const { result } = renderHook(() => useEvents());
    const initialCount = result.current.events.length;

    await act(async () => {
      result.current.addEvent(validFormData);
    });

    expect(result.current.events.length).toBe(initialCount + 1);
  });

  it('persists the new event in localStorage', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent(validFormData);
    });

    const stored = JSON.parse(localStorage.getItem('sportradar-events') ?? '[]');
    const added = stored.find((e: { id: string }) => e.id === 'real-madrid-vs-barcelona-2025-06-15');
    expect(added).toBeDefined();
  });

  it('generates id from slugified team names and date', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent(validFormData);
    });

    const added = result.current.events.find(
      (e) => e.id === 'real-madrid-vs-barcelona-2025-06-15',
    );
    expect(added).toBeDefined();
  });

  it('sets status to scheduled', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent(validFormData);
    });

    const added = result.current.events.find(
      (e) => e.id === 'real-madrid-vs-barcelona-2025-06-15',
    );
    expect(added?.status).toBe('scheduled');
  });

  it('sets stadium to null when empty string provided', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent({ ...validFormData, stadium: '' });
    });

    const added = result.current.events.find(
      (e) => e.id === 'real-madrid-vs-barcelona-2025-06-15',
    );
    expect(added?.stadium).toBeNull();
  });

  it('generates correct 3-letter abbreviation from team name', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent(validFormData);
    });

    const added = result.current.events.find(
      (e) => e.id === 'real-madrid-vs-barcelona-2025-06-15',
    );
    expect(added?.homeTeam?.abbreviation).toBe('REA');
    expect(added?.awayTeam?.abbreviation).toBe('BAR');
  });

  it('uses default competition name when competitionName is empty', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      result.current.addEvent({ ...validFormData, competitionName: '' });
    });

    const added = result.current.events.find(
      (e) => e.id === 'real-madrid-vs-barcelona-2025-06-15',
    );
    expect(added?.originCompetitionName).toBe('Custom Event');
  });
});
