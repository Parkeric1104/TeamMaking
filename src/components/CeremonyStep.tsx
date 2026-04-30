import { useState } from 'react';
import type { Award, PairedTeam } from '../types';
import { PRESET_AWARDS } from '../types';

interface CeremonyEntry {
  award: Award;
  team: PairedTeam;
  awardIndex: number;
}

interface Props {
  teams: PairedTeam[];
  awards: Record<number, Award>;
  onDone: () => void;
}

export default function CeremonyStep({ teams, awards, onDone }: Props) {
  // Build ceremony list sorted least → most prestigious (특별상 first, 1등 last)
  const ceremonyList: CeremonyEntry[] = Object.entries(awards)
    .map(([teamNum, award]) => {
      const team = teams.find((t) => t.teamNumber === Number(teamNum))!;
      const awardIndex = PRESET_AWARDS.findIndex((a) => a.label === award.label);
      return { award, team, awardIndex };
    })
    .sort((a, b) => b.awardIndex - a.awardIndex);

  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const entry = ceremonyList[current];
  const isLast = current === ceremonyList.length - 1;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    if (isLast) {
      setAllDone(true);
    } else {
      setRevealed(false);
      setTimeout(() => setCurrent((c) => c + 1), 50);
    }
  };

  if (allDone) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🎊</div>
          <p className="text-lg font-bold" style={{ color: '#191F28' }}>시상 완료</p>
          <p className="text-sm" style={{ color: '#8B95A1' }}>수고하셨습니다!</p>
        </div>

        <div className="rounded-3xl bg-white flex flex-col divide-y" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {ceremonyList.map(({ award, team }) => (
            <div key={team.teamNumber} className="flex items-center gap-4 px-5 py-4">
              <span style={{ fontSize: 28 }}>{award.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: award.color }}>{award.label}</p>
                <p className="text-sm font-semibold" style={{ color: '#191F28' }}>
                  {team.players.map((p) => p.name).join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onDone}
          className="h-14 rounded-2xl text-base font-bold"
          style={{ backgroundColor: '#3182F6', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(49,130,246,0.3)' }}
        >
          확인
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 진행 표시 */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold" style={{ color: '#8B95A1' }}>
          {current + 1} / {ceremonyList.length}
        </p>
        <div className="flex gap-1">
          {ceremonyList.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === current ? 20 : 8,
                backgroundColor: i <= current ? '#3182F6' : '#E5E8EB',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* 시상 카드 */}
      <div
        key={current}
        className="rounded-3xl flex flex-col items-center justify-center py-12 px-6 gap-4"
        style={{
          backgroundColor: entry.award.bg,
          border: `2px solid ${entry.award.color}33`,
          minHeight: 320,
          animation: 'ceremonyIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* 시상 종류 */}
        <div
          className="px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ backgroundColor: entry.award.color + '22', color: entry.award.color }}
        >
          {entry.award.label}
        </div>

        {/* 이모지 */}
        <div style={{ fontSize: 72, lineHeight: 1, filter: revealed ? 'none' : 'blur(8px)', transition: 'filter 0.4s' }}>
          {entry.award.emoji}
        </div>

        {/* 팀 정보 */}
        {revealed ? (
          <div className="flex flex-col items-center gap-2" style={{ animation: 'ceremonyReveal 0.35s ease-out' }}>
            <div className="flex flex-wrap justify-center gap-2">
              {entry.team.players.map((player) => (
                <span
                  key={player.id}
                  className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-white"
                  style={{ color: '#191F28', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {entry.team.players.map((player) => (
                <span
                  key={player.id}
                  className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-white"
                  style={{ color: '#191F28', filter: 'blur(6px)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 버튼 */}
      {!revealed ? (
        <button
          type="button"
          onClick={handleReveal}
          className="h-14 rounded-2xl text-base font-bold"
          style={{
            backgroundColor: entry.award.color,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 4px 16px ${entry.award.color}55`,
          }}
        >
          공개하기 ✨
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="h-14 rounded-2xl text-base font-bold"
          style={{
            backgroundColor: isLast ? '#3182F6' : '#191F28',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: isLast ? '0 4px 16px rgba(49,130,246,0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {isLast ? '시상 완료 🎊' : '다음 시상 →'}
        </button>
      )}

      <style>{`
        @keyframes ceremonyIn {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ceremonyReveal {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
