import { useState } from 'react';
import type { Award, PairedTeam } from '../types';
import AwardPicker from './AwardPicker';

interface Props {
  teams: PairedTeam[];
  awards: Record<number, Award>;
  onSetAward: (teamNumber: number, award: Award | null) => void;
  onBack: () => void;
  onReveal: () => void;
}

export default function AwardingStep({ teams, awards, onSetAward, onBack, onReveal }: Props) {
  const [pickerTeam, setPickerTeam] = useState<number | null>(null);
  const awardedCount = Object.keys(awards).length;

  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-base font-bold" style={{ color: '#191F28' }}>시상 대상 선택</p>
          <p className="text-xs" style={{ color: '#8B95A1' }}>각 팀에 시상을 지정하세요</p>
        </div>
      </div>

      {/* 팀 목록 */}
      <div className="rounded-3xl bg-white flex flex-col divide-y divide-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {teams.map((team) => {
          const award = awards[team.teamNumber] ?? null;
          return (
            <div
              key={team.teamNumber}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: award ? award.color : '#3182F6' }}
                >
                  {team.teamNumber}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#191F28' }}>
                    {team.teamName}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#8B95A1', maxWidth: 160 }}>
                    {team.players.map((p) => p.name).join(' · ')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPickerTeam(team.teamNumber)}
                className="flex items-center gap-1.5 px-3 h-8 rounded-xl flex-shrink-0 ml-2"
                style={{
                  backgroundColor: award ? award.bg : '#F2F4F6',
                  border: award ? `1.5px solid ${award.color}44` : '1.5px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {award ? (
                  <>
                    <span style={{ fontSize: 14 }}>{award.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: award.color }}>{award.label}</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 13 }}>🏆</span>
                    <span className="text-xs font-semibold" style={{ color: '#8B95A1' }}>시상</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 시상 발표 버튼 */}
      <button
        type="button"
        onClick={onReveal}
        disabled={awardedCount === 0}
        className="h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2"
        style={{
          backgroundColor: awardedCount > 0 ? '#3182F6' : '#D1D6DB',
          color: 'white',
          border: 'none',
          cursor: awardedCount > 0 ? 'pointer' : 'not-allowed',
          boxShadow: awardedCount > 0 ? '0 4px 16px rgba(49,130,246,0.3)' : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2L11.09 7.26L17 8.27L13 12.14L14.18 18L9 15.27L3.82 18L5 12.14L1 8.27L6.91 7.26L9 2Z"
            stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill={awardedCount > 0 ? 'white' : 'none'} fillOpacity="0.3" />
        </svg>
        {awardedCount > 0 ? `시상 발표하기 (${awardedCount}팀)` : '시상할 팀을 선택하세요'}
      </button>

      {pickerTeam !== null && (
        <AwardPicker
          teamNumber={pickerTeam}
          current={awards[pickerTeam] ?? null}
          onSelect={(award) => onSetAward(pickerTeam, award)}
          onClose={() => setPickerTeam(null)}
        />
      )}
    </div>
  );
}
