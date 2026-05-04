import { useState, useRef } from 'react';
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
  onUpdateName?: (name: string) => void;
}

export default function TeamCard({ team, award, onAwardClick, onUpdateName }: Props) {
  const p = PALETTES[(team.teamNumber - 1) % PALETTES.length];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(team.teamName);
  const inputRef = useRef<HTMLInputElement>(null);

  const accentColor = award ? award.color : p.accent;

  const handleNameClick = () => {
    if (!onUpdateName) return;
    setDraft(team.teamName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitName = () => {
    const trimmed = draft.trim() || team.teamName;
    onUpdateName?.(trimmed);
    setEditing(false);
  };

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        backgroundColor: award ? award.bg : p.bg,
        border: award ? `2px solid ${award.color}33` : '2px solid transparent',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {team.teamNumber}
          </div>

          {/* 팀명 — 클릭하면 편집 */}
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') setEditing(false);
              }}
              className="flex-1 min-w-0 text-sm font-bold rounded-lg px-1.5 py-0.5"
              style={{
                color: '#191F28',
                border: `1.5px solid ${accentColor}`,
                outline: 'none',
                backgroundColor: 'white',
              }}
            />
          ) : (
            <span
              className="text-sm font-bold truncate"
              style={{
                color: '#191F28',
                cursor: onUpdateName ? 'text' : 'default',
              }}
              onClick={handleNameClick}
              title={onUpdateName ? '클릭하여 팀명 수정' : undefined}
            >
              {team.teamName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {team.isPreFormed && !award && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: p.accent + '22', color: p.text }}
            >
              사전
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
                fontSize: 13,
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
            className="flex-1 flex items-center justify-center py-3 rounded-xl bg-white"
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
