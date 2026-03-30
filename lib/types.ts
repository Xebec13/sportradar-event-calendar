export interface Team {
  name: string;
  officialName: string;
  slug: string;
  abbreviation: string;       // 3-char uppercase display label (e.g. "REA")
  teamCountryCode: string;
  stagePosition: number | null; // league table position; null for user-added events
}

export interface Goal {
  minute: number;
  scorer: string;
  assistedBy: string | null;
  team: 'home' | 'away';
}

export interface Card {
  minute: number;
  player: string;
  team: 'home' | 'away';
}

export interface ScoreByPeriod {
  period: string;
  homeGoals: number;
  awayGoals: number;
}

// EventResult holds the full outcome of a played match — null on SportEvent when not yet played
export interface EventResult {
  homeGoals: number;
  awayGoals: number;
  winner: string | null;        // winner team name; null = draw
  winnerId: string | null;      // winner team id; null = draw
  message: string | null;
  goals: Goal[];
  yellowCards: Card[];
  secondYellowCards: Card[];    // second yellow resulting in red — tracked separately from direct reds
  directRedCards: Card[];
  scoreByPeriods: ScoreByPeriod[] | null;
}

export interface EventStage {
  id: string;
  name: string;
  ordering: number;
}

// NewEventFormData mirrors the add-event form fields — all strings for controlled input compatibility
export interface NewEventFormData {
  homeTeam: string;
  awayTeam: string;
  dateVenue: string;       // YYYY-MM-DD
  timeVenueUTC: string;    // HH:MM
  sport: string;
  stadium: string;
  competitionName: string;
}

// FormErrors is a partial map of NewEventFormData keys to error message strings
export type FormErrors = Partial<Record<keyof NewEventFormData, string>>;

export interface SportEvent {
  id: string;
  sport: string;
  season: number;
  status: 'played' | 'scheduled' | 'live' | 'cancelled'; // 'played' = FT; 'cancelled' = abandoned
  timeVenueUTC: string;   // HH:MM:SS
  dateVenue: string;      // YYYY-MM-DD
  stadium: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  result: EventResult | null; // null when status is not 'played'
  stage: EventStage;
  group: string | null;
  originCompetitionId: string;   // slug of the parent competition
  originCompetitionName: string; // display name of the parent competition
}

// EventFilter maps to URL searchParams — all fields optional, any combination is valid
export interface EventFilter {
  sport?: string;
  dateFrom?: string; // YYYY-MM-DD inclusive
  dateTo?: string;   // YYYY-MM-DD inclusive
}
