import type { Team } from '../types';
import RatingStars from './RatingStars';

const TEAM_COLORS = [
  { bg: '#EBF3FE', accent: '#3182F6', label: '#1B6EF3' },
  { bg: '#FFF0F0', accent: '#FF6B6B', label: '#E53E3E' },
  { bg: '#F0FFF4', accent: '#26DE81', label: '#22A757' },
  { bg: '#FFF8E1', accent: '#FFCA28', label: '#D4A017' },
  { bg: '#F3E8FF', accent: '#9B59B6', label: '#7D3C98' },
  { bg: '#FFF0E6', accent: '#FF9F43', label: '#E67E22' },
];

interface Props {
  team: Team;
  avgRating: number;
}

export default function TeamCard({ team, avgRating }: Props) {
  const color = TEAM_COLORS[(team.id - 1) % TEAM_COLORS.length];

  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: color.bg }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: color.accent }}
          >
            {team.id}
          </div>
          <span className="font-bold text-base" style={{ color: '#191F28' }}>
            팀 {team.id}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium" style={{ color: color.label }}>
            총 {team.totalRating}점
          </div>
          <div className="text-xs" style={{ color: '#8B95A1' }}>
            평균 {avgRating.toFixed(1)}점
          </div>
        </div>
      </div>

      {/* 선수 목록 */}
      <div className="flex flex-col gap-2">
        {team.players.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#191F28' }}>
              {p.name || '(이름 없음)'}
            </span>
            <RatingStars value={p.rating} readonly size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
