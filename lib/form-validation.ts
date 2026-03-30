import type { NewEventFormData, FormErrors } from '@/lib/types';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

export function validateNewEvent(data: NewEventFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.homeTeam.trim()) {
    errors.homeTeam = 'Home team is required';
  } else if (data.homeTeam.trim().length < 2) {
    errors.homeTeam = 'Home team name must be at least 2 characters';
  }

  if (!data.awayTeam.trim()) {
    errors.awayTeam = 'Away team is required';
  } else if (data.awayTeam.trim().length < 2) {
    errors.awayTeam = 'Away team name must be at least 2 characters';
  } else if (data.awayTeam.trim().toLowerCase() === data.homeTeam.trim().toLowerCase()) {
    errors.awayTeam = 'Away team must differ from home team';
  }

  if (!data.dateVenue) {
    errors.dateVenue = 'Date is required';
  } else if (!DATE_REGEX.test(data.dateVenue)) {
    errors.dateVenue = 'Invalid date format';
  }

  if (!data.timeVenueUTC) {
    errors.timeVenueUTC = 'Time is required';
  } else if (!TIME_REGEX.test(data.timeVenueUTC)) {
    errors.timeVenueUTC = 'Invalid time format';
  }

  if (!data.sport) {
    errors.sport = 'Sport is required';
  }

  return errors;
}

export function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}
