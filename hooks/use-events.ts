'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadEvents, saveEvents } from '@/lib/local-storage';
import eventsData from '@/data/events.json';
import type { SportEvent, NewEventFormData } from '@/lib/types';

// Pure helpers kept here because they are only used to build SportEvent from form data
function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Maps form input to a full SportEvent shape
// id = "home-vs-away-YYYY-MM-DD"; abbreviation = first 3 chars uppercased; competitionName falls back to "Custom Event"
function formDataToEvent(data: NewEventFormData): SportEvent {
  const homeSlug = slugify(data.homeTeam);
  const awaySlug = slugify(data.awayTeam);
  return {
    id: `${homeSlug}-vs-${awaySlug}-${data.dateVenue}`,
    sport: data.sport,
    season: new Date(data.dateVenue).getFullYear(),
    status: 'scheduled',
    timeVenueUTC: `${data.timeVenueUTC}:00`,
    dateVenue: data.dateVenue,
    stadium: data.stadium.trim() || null,
    homeTeam: {
      name: data.homeTeam.trim(),
      officialName: data.homeTeam.trim(),
      slug: homeSlug,
      abbreviation: data.homeTeam.trim().slice(0, 3).toUpperCase(),
      teamCountryCode: '',
      stagePosition: null,
    },
    awayTeam: {
      name: data.awayTeam.trim(),
      officialName: data.awayTeam.trim(),
      slug: awaySlug,
      abbreviation: data.awayTeam.trim().slice(0, 3).toUpperCase(),
      teamCountryCode: '',
      stagePosition: null,
    },
    result: null,
    stage: { id: 'CUSTOM', name: data.competitionName.trim() || 'Custom Event', ordering: 0 },
    group: null,
    originCompetitionId: slugify(data.competitionName.trim() || 'Custom Event'),
    originCompetitionName: data.competitionName.trim() || 'Custom Event',
  };
}

export function useEvents() {
  const [events, setEvents] = useState<SportEvent[]>(eventsData.data as SportEvent[]);

  useEffect(() => {
    // SSR-safe hydration: seed on server, localStorage on client — intentional double render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(loadEvents());

    const handler = () => setEvents(loadEvents());
    window.addEventListener('storage', handler);
    window.addEventListener('events-updated', handler); // custom event — syncs state across same-tab dispatches
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('events-updated', handler);
    };
  }, []);

  const addEvent = useCallback((data: NewEventFormData) => {
    const newEvent = formDataToEvent(data);
    const updated = [...loadEvents(), newEvent]; // loadEvents() called fresh — avoids stale closure over `events` state
    saveEvents(updated);
    window.dispatchEvent(new Event('events-updated'));
  }, []);

  return { events, addEvent };
}