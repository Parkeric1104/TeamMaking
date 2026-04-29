import type { Award, PairedTeam } from '../types';

const PALETTES = [
  { bg: '#EBF3FE', accent: '#3182F6', text: '#1B6EF3' },
  { bg: '#FFF0F0', accent: '#FF6B6B', text: '#E53E3E' },
  { bg: '#F0FFF4', accent: '#26DE81', text: '#22A757' },
  { bg: '#FFF8E1', accent: '#FFCA28', text: '#D4A017' },
  { bg: '#F3E8FF', accent: '#9B59B6', text: '#7D3C98' },
  { bg: '#FFF0E6', accent: '#FF9F43', text: '#E67E22' },
  { bg: '#E8F8FF', accent: '#00B4D8', text: '#0096C7' },
  { bg: '#F0F7FF', accent: '#4361EE', text: '#3A56D4' },
];

interface Props {
  team: PairedTeam;
  award?: Award | null;
  onAwardClick?: () => void;
}

export default function TeamCard({ team, award, onAwardClick }: Props) {
  const p = PALETTES[(team.teamNumber - 1) % PALETTES.length];

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 relative"
      style={{
        backgroundColor: award ? award.bg : p.bg,
        border: award ? `2px solid ${award.color}33` : '2px solid transparent',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: award ? award.color : p.accent }}
          >
            {team.teamNumber}
          </div>
          <span className="text-sm font-bold" style={{ color: '#191F28' }}>
            팀 {team.teamNumber}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {team.isPreFormed && !award && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: p.accent + '22', color: p.text }}
            >
              사전 팀
            </span>
          )}
          {award && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: award.color + '22', color: award.color }}
            >
              {award.emoji} {award.label}
            </span>
          )}
          {onAwardClick && (
            <button
              type="button"
              onClick={onAwardClick}
              className="w-7 h-7 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: award ? award.color + '22' : '#E5E8EB',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
              }}
              title="시상하기"
            >
              🏆
            </button>
          )}
        </div>
      </div>

      {/* 멤버 */}
      <div className="flex gap-2">
        {team.players.map((player) => (
          <div
            key={player.id}
            className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl bg-white gap-1"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <span className="text-sm font-semibold text-center px-1 leading-tight" style={{ color: '#191F28' }}>
              {player.name || '(이름 없음)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
