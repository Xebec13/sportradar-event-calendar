import { describe, it, expect } from 'vitest';
import { validateNewEvent, isFormValid } from '@/lib/form-validation';
import type { NewEventFormData } from '@/lib/types';

const validData: NewEventFormData = {
  homeTeam: 'Real Madrid',
  awayTeam: 'Barcelona',
  dateVenue: '2025-06-15',
  timeVenueUTC: '20:00',
  sport: 'soccer',
  stadium: 'Santiago Bernabéu',
  competitionName: 'La Liga',
};

describe('validateNewEvent', () => {
  it('returns no errors for valid data', () => {
    expect(validateNewEvent(validData)).toEqual({});
  });

  describe('homeTeam', () => {
    it('errors when empty', () => {
      const errors = validateNewEvent({ ...validData, homeTeam: '' });
      expect(errors.homeTeam).toBeDefined();
    });

    it('errors when only whitespace', () => {
      const errors = validateNewEvent({ ...validData, homeTeam: '   ' });
      expect(errors.homeTeam).toBeDefined();
    });

    it('errors when shorter than 2 characters', () => {
      const errors = validateNewEvent({ ...validData, homeTeam: 'A' });
      expect(errors.homeTeam).toBeDefined();
    });

    it('passes when exactly 2 characters', () => {
      const errors = validateNewEvent({ ...validData, homeTeam: 'AC' });
      expect(errors.homeTeam).toBeUndefined();
    });
  });

  describe('awayTeam', () => {
    it('errors when empty', () => {
      const errors = validateNewEvent({ ...validData, awayTeam: '' });
      expect(errors.awayTeam).toBeDefined();
    });

    it('errors when shorter than 2 characters', () => {
      const errors = validateNewEvent({ ...validData, awayTeam: 'B' });
      expect(errors.awayTeam).toBeDefined();
    });

    it('errors when same as homeTeam (case-insensitive)', () => {
      const errors = validateNewEvent({ ...validData, awayTeam: 'real madrid' });
      expect(errors.awayTeam).toBeDefined();
    });

    it('passes when different from homeTeam', () => {
      const errors = validateNewEvent({ ...validData, awayTeam: 'Atletico' });
      expect(errors.awayTeam).toBeUndefined();
    });
  });

  describe('dateVenue', () => {
    it('errors when empty', () => {
      const errors = validateNewEvent({ ...validData, dateVenue: '' });
      expect(errors.dateVenue).toBeDefined();
    });

    it('errors for invalid format (DD/MM/YYYY)', () => {
      const errors = validateNewEvent({ ...validData, dateVenue: '15/06/2025' });
      expect(errors.dateVenue).toBeDefined();
    });

    it('errors for partial date', () => {
      const errors = validateNewEvent({ ...validData, dateVenue: '2025-06' });
      expect(errors.dateVenue).toBeDefined();
    });

    it('passes for correct YYYY-MM-DD format', () => {
      const errors = validateNewEvent({ ...validData, dateVenue: '2025-12-31' });
      expect(errors.dateVenue).toBeUndefined();
    });
  });

  describe('timeVenueUTC', () => {
    it('errors when empty', () => {
      const errors = validateNewEvent({ ...validData, timeVenueUTC: '' });
      expect(errors.timeVenueUTC).toBeDefined();
    });

    it('errors for invalid format (HH:MM:SS)', () => {
      const errors = validateNewEvent({ ...validData, timeVenueUTC: '20:00:00' });
      expect(errors.timeVenueUTC).toBeDefined();
    });

    it('errors for single-digit hours without padding', () => {
      const errors = validateNewEvent({ ...validData, timeVenueUTC: '8:00' });
      expect(errors.timeVenueUTC).toBeDefined();
    });

    it('passes for correct HH:MM format', () => {
      const errors = validateNewEvent({ ...validData, timeVenueUTC: '08:30' });
      expect(errors.timeVenueUTC).toBeUndefined();
    });
  });

  describe('sport', () => {
    it('errors when empty', () => {
      const errors = validateNewEvent({ ...validData, sport: '' });
      expect(errors.sport).toBeDefined();
    });

    it('passes for any non-empty sport value', () => {
      const errors = validateNewEvent({ ...validData, sport: 'basketball' });
      expect(errors.sport).toBeUndefined();
    });
  });

  it('can return multiple errors at once', () => {
    const errors = validateNewEvent({
      ...validData,
      homeTeam: '',
      dateVenue: 'bad-date',
    });
    expect(errors.homeTeam).toBeDefined();
    expect(errors.dateVenue).toBeDefined();
  });
});

describe('isFormValid', () => {
  it('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns false when there is at least one error', () => {
    expect(isFormValid({ homeTeam: 'Home team is required' })).toBe(false);
  });

  it('returns false when there are multiple errors', () => {
    expect(isFormValid({ homeTeam: 'required', awayTeam: 'required' })).toBe(false);
  });
});
