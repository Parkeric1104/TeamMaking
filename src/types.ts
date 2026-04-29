export interface Player {
  id: string;
  name: string;
  rating: number; // 1~5
}

export interface Team {
  id: number;
  players: Player[];
  totalRating: number;
}

export type Step = 'setup' | 'result';
