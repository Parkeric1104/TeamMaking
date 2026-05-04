import { useState, useCallback, useRef, useEffect } from 'react';
import type { Award, Player, PrePair, PairedTeam, Step } from './types';
import { makeRandomTeams } from './utils/random';
import PlayerRow from './components/PlayerRow';
import TeamCard from './components/TeamCard';
import ExcelImport from './components/ExcelImport';
import PrePairSection from './components/PrePairSection';
import ReviewStep from './components/ReviewStep';
import GeneratingStep from './components/GeneratingStep';
import AwardingStep from './components/AwardingStep';
import CeremonyStep from './components/CeremonyStep';
import { Minihompy } from './components/Minihompy';

const MAX_TEAMS = 50;
const MAX_PLAYERS = MAX_TEAMS * 2;

function createPlayer(name = ''): Player {
  return { id: crypto.randomUUID(), name };
}

const STORAGE_KEY = 'tm_state';

type SavedState = {
  step: Step;
  players: Player[];
  prePairs: PrePair[];
  teams: PairedTeam[];
  awards: Record<number, Award>;
};

function encodeShareUrl(teams: PairedTeam[], awards: Record<number, Award>): string {
  const data = JSON.stringify({ teams, awards });
  return btoa(encodeURIComponent(data));
}

function decodeShareUrl(hash: string): Pick<SavedState, 'teams' | 'awards'> | null {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch {
    return null;
  }
}

function loadState(): SavedState | null {
  // URL 해시에서 먼저 복원 (공유 링크)
  const hash = window.location.hash.slice(1);
  if (hash) {
    const decoded = decodeShareUrl(hash);
    if (decoded?.teams?.length) {
      return { step: 'result', players: [], prePairs: [], ...decoded };
    }
  }
  // localStorage 폴백
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

export default function App() {
  const [showMinihompy, setShowMinihompy] = useState(false);
  const saved = loadState();
  const [step, setStep] = useState<Step>(saved?.step ?? 'setup');
  const [players, setPlayers] = useState<Player[]>(
    saved?.players?.length ? saved.players : [createPlayer(), createPlayer()]
  );
  const [prePairs, setPrePairs] = useState<PrePair[]>(saved?.prePairs ?? []);
  const [teams, setTeams] = useState<PairedTeam[]>(saved?.teams ?? []);
  const [awards, setAwards] = useState<Record<number, Award>>(saved?.awards ?? {});
  const [randomTeamNames, setRandomTeamNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'manual' | 'excel'>('manual');
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── localStorage 동기화 ── */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, players, prePairs, teams, awards }));
  }, [step, players, prePairs, teams, awards]);

  /* ── URL 해시 동기화 (result일 때만) ── */
  useEffect(() => {
    if ((step === 'result' || step === 'awarding' || step === 'ceremony') && teams.length > 0) {
      window.history.replaceState(null, '', '#' + encodeShareUrl(teams, awards));
    } else if (step === 'setup') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [step, teams, awards]);

  /* ── 참가자 조작 ── */
  const addPlayer = useCallback(() => {
    if (players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [...prev, createPlayer()]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [players.length]);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    // 연관 사전 팀도 제거
    setPrePairs((prev) => prev.filter((pair) => pair.p1Id !== id && pair.p2Id !== id));
  }, []);

  const updatePlayer = useCallback((id: string, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  /* ── 사전 팀 조작 ── */
  const addPrePair = useCallback((p1Id: string, p2Id: string) => {
    setPrePairs((prev) => [...prev, { id: crypto.randomUUID(), p1Id, p2Id }]);
  }, []);

  const removePrePair = useCallback((id: string) => {
    setPrePairs((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /* ── 엑셀 임포트 ── */
  const importFromExcel = useCallback((imported: Player[], importedPairs: PrePair[], importedRandomNames: string[]) => {
    setPlayers((prev) => {
      const merged = [...prev.filter((p) => p.name), ...imported];
      return merged.slice(0, MAX_PLAYERS);
    });
    setPrePairs((prev) => [...prev, ...importedPairs]);
    if (importedRandomNames.length > 0) setRandomTeamNames(importedRandomNames);
    setActiveTab('manual');
  }, []);

  /* ── 팀 생성 ── */
  const validPlayers = players.filter((p) => p.name.trim());
  const pairedIds = new Set(prePairs.flatMap((p) => [p.p1Id, p.p2Id]));
  const soloCount = validPlayers.filter((p) => !pairedIds.has(p.id)).length;
  const expectedTeams = prePairs.length + Math.floor(soloCount / 2);
  const canGenerate = validPlayers.length >= 2;

  const handleGoReview = () => {
    if (!canGenerate) return;
    setStep('review');
  };

  const handleGenerate = useCallback(() => {
    setStep('generating');
  }, []);

  const handleGeneratingDone = useCallback(() => {
    setTeams(makeRandomTeams(validPlayers, prePairs, randomTeamNames));
    setStep('result');
  }, [validPlayers, prePairs, randomTeamNames]);

  const handleReshuffle = () => {
    setStep('generating');
  };

  const handleReshuffleDone = useCallback(() => {
    setTeams(makeRandomTeams(validPlayers, prePairs, randomTeamNames));
    setStep('result');
  }, [validPlayers, prePairs, randomTeamNames]);

  const handleUpdateTeamName = useCallback((teamNumber: number, name: string) => {
    setTeams((prev) => prev.map((t) => t.teamNumber === teamNumber ? { ...t, teamName: name } : t));
  }, []);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep('setup');
    setPlayers([createPlayer(), createPlayer()]);
    setPrePairs([]);
    setTeams([]);
    setAwards({});
  };

  const handleSetAward = useCallback((teamNumber: number, award: Award | null) => {
    setAwards((prev) => {
      const next = { ...prev };
      if (award) next[teamNumber] = award;
      else delete next[teamNumber];
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F4F6' }}>
      {showMinihompy && <Minihompy onClose={() => setShowMinihompy(false)} />}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-10">

        {/* 헤더 — setup 화면에서만 표시 */}
        {step === 'setup' && (
          <div className="mb-8 text-center relative">
            <p className="text-2xl font-extrabold tracking-tight" style={{ color: '#191F28' }}>
              DOUZONE <span style={{ color: '#F97316' }}>×</span> Replit
            </p>
            <p className="text-base font-semibold mt-0.5" style={{ color: '#8B95A1' }}>
              Makeathon 2026 · Team Maker
            </p>
            <button
              onClick={() => setShowMinihompy(true)}
              style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: '#C9CDD3', padding: '4px 8px',
              }}
              title="Cy★World 미니홈피"
            >
              Cy★
            </button>
          </div>
        )}

        {step === 'setup' && (
          <SetupStep
            players={players}
            prePairs={prePairs}
            validCount={validPlayers.length}
            expectedTeams={expectedTeams}
            activeTab={activeTab}
            canGenerate={canGenerate}
            bottomRef={bottomRef}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onUpdatePlayer={updatePlayer}
            onAddPrePair={addPrePair}
            onRemovePrePair={removePrePair}
            onImportExcel={importFromExcel}
            onTabChange={setActiveTab}
            onGenerate={handleGoReview}
          />
        )}

        {step === 'review' && (
          <ReviewStep
            players={validPlayers}
            prePairs={prePairs}
            onBack={() => setStep('setup')}
            onGenerate={handleGenerate}
          />
        )}

        {step === 'generating' && (
          <GeneratingStep
            names={validPlayers.map((p) => p.name)}
            onDone={teams.length > 0 ? handleReshuffleDone : handleGeneratingDone}
          />
        )}

        {step === 'result' && (
          <ResultStep
            teams={teams}
            awards={awards}
            onReshuffle={handleReshuffle}
            onReset={handleReset}
            onGoAward={() => setStep('awarding')}
            onUpdateTeamName={handleUpdateTeamName}
          />
        )}

        {step === 'awarding' && (
          <AwardingStep
            teams={teams}
            awards={awards}
            onSetAward={handleSetAward}
            onBack={() => setStep('result')}
            onReveal={() => setStep('ceremony')}
          />
        )}

        {step === 'ceremony' && (
          <CeremonyStep
            teams={teams}
            awards={awards}
            onDone={() => setStep('result')}
          />
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────── Setup ────────────────────────────────── */

interface SetupProps {
  players: Player[];
  prePairs: PrePair[];
  validCount: number;
  expectedTeams: number;
  activeTab: 'manual' | 'excel';
  canGenerate: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayer: (id: string, name: string) => void;
  onAddPrePair: (p1Id: string, p2Id: string) => void;
  onRemovePrePair: (id: string) => void;
  onImportExcel: (players: Player[], prePairs: PrePair[], randomTeamNames: string[]) => void;
  onTabChange: (tab: 'manual' | 'excel') => void;
  onGenerate: () => void;
}

function SetupStep({
  players, prePairs, validCount, expectedTeams, activeTab, canGenerate, bottomRef,
  onAddPlayer, onRemovePlayer, onUpdatePlayer, onAddPrePair, onRemovePrePair, onImportExcel, onTabChange, onGenerate,
}: SetupProps) {
  const pairedIds = new Set(prePairs.flatMap((p) => [p.p1Id, p.p2Id]));

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto w-full">
      {/* 탭 */}
      <div className="flex rounded-2xl p-1 gap-1" style={{ backgroundColor: '#E5E8EB' }}>
        {(['manual', 'excel'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className="flex-1 h-9 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#191F28' : '#8B95A1',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'manual' ? '직접 입력' : '엑셀 업로드'}
          </button>
        ))}
      </div>

      {activeTab === 'manual' && (
        <div className="flex flex-col gap-5">
          {/* 참가자 카드 */}
          <div className="rounded-3xl p-6 bg-white flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold" style={{ color: '#191F28' }}>
                참가자
                <span className="ml-2 text-sm font-normal" style={{ color: '#8B95A1' }}>{validCount}명</span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {players.map((p, i) => (
                <PlayerRow
                  key={p.id}
                  player={p}
                  index={i}
                  isPaired={pairedIds.has(p.id)}
                  onUpdate={onUpdatePlayer}
                  onRemove={onRemovePlayer}
                />
              ))}
            </div>
            <div ref={bottomRef} />

            <button
              type="button"
              onClick={onAddPlayer}
              disabled={players.length >= MAX_PLAYERS}
              className="w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: '#F2F4F6',
                color: players.length >= MAX_PLAYERS ? '#B0B8C1' : '#6B7684',
                border: 'none',
                cursor: players.length >= MAX_PLAYERS ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              참가자 추가
            </button>
          </div>

          {/* 사전 팀 카드 */}
          <div className="rounded-3xl p-6 bg-white flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold" style={{ color: '#191F28' }}>
                사전 팀
                {prePairs.length > 0 && (
                  <span className="ml-2 text-sm font-normal" style={{ color: '#8B95A1' }}>{prePairs.length}쌍</span>
                )}
              </span>
              <span className="text-xs" style={{ color: '#8B95A1' }}>미리 짝을 정한 경우</span>
            </div>

            <PrePairSection
              players={players}
              prePairs={prePairs}
              onAdd={onAddPrePair}
              onRemove={onRemovePrePair}
            />
          </div>
        </div>
      )}

      {activeTab === 'excel' && (
        <div className="rounded-3xl p-6 bg-white max-w-lg" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ExcelImport onImport={onImportExcel} />
        </div>
      )}

      {/* 예상 팀 수 + 생성 버튼 */}
      <div className="flex items-center gap-4">
        {canGenerate && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ backgroundColor: '#EBF3FE' }}>
            <span className="text-sm" style={{ color: '#3182F6' }}>예상 팀 수</span>
            <span className="text-sm font-bold" style={{ color: '#3182F6' }}>{expectedTeams}팀</span>
          </div>
        )}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="flex-1 h-14 rounded-2xl text-base font-bold"
          style={{
            backgroundColor: canGenerate ? '#3182F6' : '#D1D6DB',
            color: 'white',
            border: 'none',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            boxShadow: canGenerate ? '0 4px 16px rgba(49,130,246,0.3)' : 'none',
          }}
        >
          랜덤 팀 구성하기
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────── Result ────────────────────────────────── */

interface ResultProps {
  teams: PairedTeam[];
  awards: Record<number, Award>;
  onReshuffle: () => void;
  onReset: () => void;
  onGoAward: () => void;
  onUpdateTeamName: (teamNumber: number, name: string) => void;
}

function ResultStep({ teams, awards, onReshuffle, onReset, onGoAward, onUpdateTeamName }: ResultProps) {
  const preFormedCount = teams.filter((t) => t.isPreFormed).length;
  const randomCount = teams.length - preFormedCount;
  const awardedCount = Object.keys(awards).length;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl p-5 bg-white flex items-center justify-between gap-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EBF3FE' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="#3182F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#191F28' }}>총 {teams.length}팀 구성 완료</p>
            <p className="text-xs" style={{ color: '#8B95A1' }}>
              {preFormedCount > 0 && `사전팀 ${preFormedCount}쌍 · `}랜덤 {randomCount}팀
              {awardedCount > 0 && ` · 시상 ${awardedCount}팀`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {preFormedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F0FFF4' }}>
              <span className="text-xs font-semibold" style={{ color: '#22A757' }}>🔒 사전 팀</span>
              <span className="text-xs" style={{ color: '#6B7684' }}>{preFormedCount}팀</span>
            </div>
          )}
          {randomCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F2F4F6' }}>
              <span className="text-xs font-semibold" style={{ color: '#4E5968' }}>🎲 랜덤 팀</span>
              <span className="text-xs" style={{ color: '#6B7684' }}>{randomCount}팀</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {teams.map((team) => (
          <TeamCard
            key={team.teamNumber}
            team={team}
            award={awards[team.teamNumber] ?? null}
            onUpdateName={(name) => onUpdateTeamName(team.teamNumber, name)}
          />
        ))}
      </div>

      {/* 액션 버튼 행 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReshuffle}
          className="h-12 rounded-2xl text-sm font-semibold px-6 no-print"
          style={{ backgroundColor: '#F2F4F6', color: '#4E5968', border: 'none', cursor: 'pointer' }}
        >
          다시 섞기
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-12 rounded-2xl text-sm font-bold px-6 no-print"
          style={{ backgroundColor: '#3182F6', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(49,130,246,0.3)' }}
        >
          처음부터
        </button>
        <div className="flex gap-2 ml-auto no-print">
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: copied ? '#F0FFF4' : '#F2F4F6', color: copied ? '#22A757' : '#6B7684', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {copied ? '✓ 복사됨' : '🔗 URL 공유'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: '#F2F4F6', color: '#6B7684', border: 'none', cursor: 'pointer' }}
          >
            🖨️ 인쇄
          </button>
        </div>
      </div>

      {/* 시상 진입 — 발표자용 비공개 버튼 */}
      <button
        type="button"
        onClick={onGoAward}
        className="no-print"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto',
          padding: '4px 12px',
          fontSize: 11,
          color: awardedCount > 0 ? '#B8860B' : '#C9CDD3',
          opacity: 0.5,
        }}
      >
        {awardedCount > 0 ? `🏆 ${awardedCount}팀 시상 지정됨` : '🏆'}
      </button>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-screen { background: white !important; }
        }
      `}</style>
    </div>
  );
}
