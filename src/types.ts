export interface Player {
  id: string;
  name: string;
}

export interface PrePair {
  id: string;
  p1Id: string;
  p2Id: string;
  teamName?: string;
}

export interface PairedTeam {
  teamNumber: number;
  teamName: string;
  players: [Player, Player] | [Player, Player, Player];
  isPreFormed: boolean;
}

export interface Award {
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export const PRESET_AWARDS: Award[] = [
  { label: '1등', emoji: '🥇', color: '#B8860B', bg: '#FFF8DC' },
  { label: '2등', emoji: '🥈', color: '#708090', bg: '#F5F5F5' },
  { label: '3등', emoji: '🥉', color: '#CD853F', bg: '#FFF0E0' },
  { label: '우수상', emoji: '🏆', color: '#3182F6', bg: '#EBF3FE' },
  { label: '장려상', emoji: '🎖️', color: '#22A757', bg: '#F0FFF4' },
  { label: '특별상', emoji: '⭐', color: '#9B59B6', bg: '#F3E8FF' },
];

export type Step = 'setup' | 'review' | 'generating' | 'result' | 'awarding' | 'ceremony';
