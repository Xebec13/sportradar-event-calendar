import { describe, it, expect } from 'vitest';
import {
  isSameDay,
  formatDateString,
  getEventsForDay,
  getMonthGrid,
} from '@/lib/date-helpers';
import type { SportEvent } from '@/lib/types';

const makeEvent = (dateVenue: string): SportEvent =>
  ({
    id: dateVenue,
    sport: 'soccer',
    season: 2025,
    status: 'scheduled',
    timeVenueUTC: '20:00:00',
    dateVenue,
    stadium: null,
    homeTeam: null,
    awayTeam: null,
    result: null,
    stage: { id: 'S1', name: 'Group', ordering: 1 },
    group: null,
    originCompetitionId: 'comp',
    originCompetitionName: 'Competition',
  } as SportEvent);

describe('isSameDay', () => {
  it('returns true for the same date', () => {
    const a = new Date(2025, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days in the same month', () => {
    const a = new Date(2025, 5, 15);
    const b = new Date(2025, 5, 16);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('returns false for different months', () => {
    const a = new Date(2025, 5, 1);
    const b = new Date(2025, 6, 1);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('returns false for different years', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('ignores time — same date different hours returns true', () => {
    const a = new Date(2025, 5, 15, 8, 0, 0);
    const b = new Date(2025, 5, 15, 23, 59, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('handles end-of-month boundary correctly', () => {
    const last = new Date(2025, 0, 31);
    const first = new Date(2025, 1, 1);
    expect(isSameDay(last, first)).toBe(false);
  });
});

describe('formatDateString', () => {
  it('formats a standard date as YYYY-MM-DD', () => {
    expect(formatDateString(new Date(2025, 5, 15))).toBe('2025-06-15');
  });

  it('pads single-digit month with leading zero', () => {
    expect(formatDateString(new Date(2025, 0, 5))).toBe('2025-01-05');
  });

  it('pads single-digit day with leading zero', () => {
    expect(formatDateString(new Date(2025, 11, 9))).toBe('2025-12-09');
  });

  it('handles end of year correctly', () => {
    expect(formatDateString(new Date(2025, 11, 31))).toBe('2025-12-31');
  });
});

describe('getEventsForDay', () => {
  const events = [
    makeEvent('2025-06-15'),
    makeEvent('2025-06-15'),
    makeEvent('2025-06-16'),
  ];

  it('returns all events matching the given date', () => {
    expect(getEventsForDay(events, '2025-06-15')).toHaveLength(2);
  });

  it('returns a single event for a date with one match', () => {
    expect(getEventsForDay(events, '2025-06-16')).toHaveLength(1);
  });

  it('returns empty array when no events match', () => {
    expect(getEventsForDay(events, '2025-06-20')).toHaveLength(0);
  });

  it('returns empty array for empty events list', () => {
    expect(getEventsForDay([], '2025-06-15')).toHaveLength(0);
  });
});

describe('getMonthGrid', () => {
  it('always returns exactly 42 cells', () => {
    expect(getMonthGrid(2025, 0)).toHaveLength(42);
    expect(getMonthGrid(2025, 1)).toHaveLength(42);
    expect(getMonthGrid(2025, 6)).toHaveLength(42);
  });

  it('marks days outside the month as isCurrentMonth: false', () => {
    const grid = getMonthGrid(2025, 5);
    const outside = grid.filter((d) => !d.isCurrentMonth);
    expect(outside.length).toBeGreaterThan(0);
  });

  it('marks all days in the requested month as isCurrentMonth: true', () => {
    const grid = getMonthGrid(2025, 5);
    const inside = grid.filter((d) => d.isCurrentMonth);
    expect(inside).toHaveLength(30);
  });

  it('first cell of the grid is a Monday (week starts on Monday)', () => {
    const grid = getMonthGrid(2025, 5);
    expect(grid[0].date.getDay()).toBe(1);
  });

  it('marks today as isToday: true and all others as false', () => {
    const now = new Date();
    const grid = getMonthGrid(now.getFullYear(), now.getMonth());
    const todayCells = grid.filter((d) => d.isToday);
    expect(todayCells).toHaveLength(1);
    expect(todayCells[0].date.getDate()).toBe(now.getDate());
  });

  it('marks no cell as isToday when viewing a different month', () => {
    const grid = getMonthGrid(2000, 0);
    expect(grid.filter((d) => d.isToday)).toHaveLength(0);
  });
});
