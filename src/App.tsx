import { useState, useCallback } from 'react';
import type { Player, Team, Step } from './types';
import { balanceTeams } from './utils/balance';
import PlayerRow from './components/PlayerRow';
import TeamCard from './components/TeamCard';

const TEAM_COLORS_BG = ['#EBF3FE', '#FFF0F0', '#F0FFF4', '#FFF8E1', '#F3E8FF', '#FFF0E6'];

function createPlayer(name = '', rating = 3): Player {
  return { id: crypto.randomUUID(), name, rating };
}

export default function App() {
  const [step, setStep] = useState<Step>('setup');
  const [players, setPlayers] = useState<Player[]>([
    createPlayer('', 3),
    createPlayer('', 3),
  ]);
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);

  const addPlayer = useCallback(() => {
    setPlayers((prev) => [...prev, createPlayer()]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePlayer = useCallback((id: string, field: keyof Player, value: string | number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  const handleGenerate = () => {
    if (players.length < numTeams) return;
    const result = balanceTeams(players, numTeams);
    setTeams(result);
    setStep('result');
  };

  const handleReshuffle = () => {
    // 같은 플레이어로 재셔플 (약간의 랜덤성 추가)
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const result = balanceTeams(shuffled, numTeams);
    setTeams(result);
  };

  const handleReset = () => {
    setStep('setup');
    setTeams([]);
  };

  const maxRating = Math.max(...teams.map((t) => t.totalRating), 1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F4F6' }}>
      <div className="mx-auto max-w-md px-4 pb-12 pt-8">

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: '#3182F6' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14L12 20L22 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#191F28' }}>
            밸런스 팀 메이커
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8B95A1' }}>
            실력 기반으로 균형 잡힌 팀을 자동 구성해요
          </p>
        </div>

        {step === 'setup' && (
          <SetupStep
            players={players}
            numTeams={numTeams}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onUpdatePlayer={updatePlayer}
            onNumTeamsChange={setNumTeams}
            onGenerate={handleGenerate}
          />
        )}

        {step === 'result' && (
          <ResultStep
            teams={teams}
            maxRating={maxRating}
            onReshuffle={handleReshuffle}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

/* ── Setup Step ─────────────────────────────────────────── */

interface SetupProps {
  players: Player[];
  numTeams: number;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayer: (id: string, field: keyof Player, value: string | number) => void;
  onNumTeamsChange: (n: number) => void;
  onGenerate: () => void;
}

function SetupStep({ players, numTeams, onAddPlayer, onRemovePlayer, onUpdatePlayer, onNumTeamsChange, onGenerate }: SetupProps) {
  const canGenerate = players.length >= numTeams && players.length >= 2;

  return (
    <div className="flex flex-col gap-4">
      {/* 팀 수 선택 */}
      <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: '#191F28' }}>팀 수</span>
          <span className="text-sm font-bold" style={{ color: '#3182F6' }}>{numTeams}팀</span>
        </div>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onNumTeamsChange(n)}
              className="flex-1 h-10 rounded-xl text-sm font-semibold"
              style={{
                backgroundColor: n === numTeams ? '#3182F6' : '#F2F4F6',
                color: n === numTeams ? 'white' : '#6B7684',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* 플레이어 목록 */}
      <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: '#191F28' }}>
            참가자
            <span className="ml-2 text-xs font-normal" style={{ color: '#8B95A1' }}>
              {players.length}명
            </span>
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#8B95A1' }}>
            <span>실력</span>
            <span style={{ fontSize: 10 }}>●●●●●</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {players.map((player, i) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={i}
              onUpdate={onUpdatePlayer}
              onRemove={onRemovePlayer}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onAddPlayer}
          className="mt-3 w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5"
          style={{
            backgroundColor: '#F2F4F6',
            color: '#6B7684',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          참가자 추가
        </button>
      </div>

      {/* 에러 메시지 */}
      {!canGenerate && players.length > 0 && (
        <p className="text-xs text-center" style={{ color: '#FF6B6B' }}>
          참가자 수({players.length}명)가 팀 수({numTeams}팀) 이상이어야 해요
        </p>
      )}

      {/* 팀 생성 버튼 */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className="h-14 rounded-2xl text-base font-bold"
        style={{
          backgroundColor: canGenerate ? '#3182F6' : '#D1D6DB',
          color: 'white',
          border: 'none',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          boxShadow: canGenerate ? '0 4px 16px rgba(49,130,246,0.35)' : 'none',
        }}
      >
        팀 자동 구성하기
      </button>
    </div>
  );
}

/* ── Result Step ─────────────────────────────────────────── */

interface ResultProps {
  teams: Team[];
  maxRating: number;
  onReshuffle: () => void;
  onReset: () => void;
}

function ResultStep({ teams, maxRating, onReshuffle, onReset }: ResultProps) {
  const ratings = teams.map((t) => t.totalRating);
  const minR = Math.min(...ratings);
  const maxR = Math.max(...ratings);
  const diff = maxR - minR;

  return (
    <div className="flex flex-col gap-4">
      {/* 밸런스 요약 */}
      <div className="rounded-3xl p-5 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: '#191F28' }}>밸런스 분석</span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: diff <= 1 ? '#F0FFF4' : diff <= 3 ? '#FFF8E1' : '#FFF0F0',
              color: diff <= 1 ? '#22A757' : diff <= 3 ? '#D4A017' : '#E53E3E',
            }}
          >
            {diff <= 1 ? '완벽 밸런스 🎯' : diff <= 3 ? '양호 밸런스 👍' : '불균형 주의 ⚠️'}
          </span>
        </div>

        {/* 팀별 점수 바 */}
        <div className="flex flex-col gap-2">
          {teams.map((t, i) => {
            const pct = maxRating > 0 ? (t.totalRating / maxRating) * 100 : 0;
            const bg = TEAM_COLORS_BG[i % TEAM_COLORS_BG.length];
            return (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-xs font-semibold w-10 text-right" style={{ color: '#6B7684' }}>
                  팀{t.id}
                </span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#F2F4F6' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: bg === '#EBF3FE' ? '#3182F6' : bg === '#FFF0F0' ? '#FF6B6B' : bg === '#F0FFF4' ? '#26DE81' : bg === '#FFF8E1' ? '#FFCA28' : bg === '#F3E8FF' ? '#9B59B6' : '#FF9F43',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-8" style={{ color: '#191F28' }}>
                  {t.totalRating}점
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs" style={{ color: '#8B95A1' }}>
          최대 점수 차이: <strong style={{ color: '#191F28' }}>{diff}점</strong>
        </p>
      </div>

      {/* 팀 카드 */}
      {teams.map((t) => (
        <TeamCard
          key={t.id}
          team={t}
          avgRating={t.players.length > 0 ? t.totalRating / t.players.length : 0}
        />
      ))}

      {/* 액션 버튼 */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onReshuffle}
          className="flex-1 h-13 rounded-2xl text-sm font-semibold"
          style={{
            backgroundColor: '#F2F4F6',
            color: '#4E5968',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          다시 섞기
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 h-13 rounded-2xl text-sm font-bold"
          style={{
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(49,130,246,0.35)',
          }}
        >
          처음부터
        </button>
      </div>
    </div>
  );
}
