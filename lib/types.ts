export interface Team {
  name: string;
  officialName: string;
  slug: string;
  abbreviation: string;
  teamCountryCode: string;
  stagePosition: number | null;
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

export interface EventResult {
  homeGoals: number;
  awayGoals: number;
  winner: string | null;
  winnerId: string | null;
  message: string | null;
  goals: Goal[];
  yellowCards: Card[];
  secondYellowCards: Card[];
  directRedCards: Card[];
  scoreByPeriods: ScoreByPeriod[] | null;
}

export interface EventStage {
  id: string;
  name: string;
  ordering: number;
}

export interface SportEvent {
  id: string;
  sport: 'soccer';
  season: number;
  status: 'played' | 'scheduled' | 'live' | 'cancelled';
  timeVenueUTC: string;
  dateVenue: string;
  stadium: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  result: EventResult | null;
  stage: EventStage;
  group: string | null;
  originCompetitionId: string;
  originCompetitionName: string;
}

export interface EventFilter {
  sport?: string;
  dateFrom?: string;
  dateTo?: string;
}
