import type { Player, PrePair } from '../types';

interface Props {
  players: Player[];
  prePairs: PrePair[];
  onBack: () => void;
  onGenerate: () => void;
}

export default function ReviewStep({ players, prePairs, onBack, onGenerate }: Props) {
  const pairedIds = new Set(prePairs.flatMap((p) => [p.p1Id, p.p2Id]));
  const playerMap = new Map(players.map((p) => [p.id, p]));
  const solos = players.filter((p) => !pairedIds.has(p.id));
  const soloTeams = Math.floor(solos.length / 2);
  const totalTeams = prePairs.length + soloTeams;
  const leftover = solos.length % 2 === 1;

  return (
    <div className="flex flex-col gap-4">
      {/* 요약 배너 */}
      <div
        className="rounded-3xl p-5 bg-white flex flex-col gap-1"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <p className="text-base font-bold" style={{ color: '#191F28' }}>참가자 확인</p>
        <p className="text-sm" style={{ color: '#8B95A1' }}>
          총 <strong style={{ color: '#191F28' }}>{players.length}명</strong>으로{' '}
          <strong style={{ color: '#3182F6' }}>{totalTeams}팀</strong>이 구성돼요
        </p>
        {leftover && (
          <p className="text-xs mt-1 px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#FFF8E1', color: '#D4A017' }}>
            ⚠️ 인원이 홀수라 마지막 팀은 3인으로 구성돼요
          </p>
        )}
      </div>

      {/* 사전 팀 목록 */}
      {prePairs.length > 0 && (
        <div className="rounded-3xl p-5 bg-white flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#EBF3FE', color: '#3182F6' }}
            >
              🔒 사전 팀
            </span>
            <span className="text-xs" style={{ color: '#8B95A1' }}>{prePairs.length}쌍 고정</span>
          </div>
          <div className="flex flex-col gap-2">
            {prePairs.map((pair, i) => {
              const p1 = playerMap.get(pair.p1Id);
              const p2 = playerMap.get(pair.p2Id);
              return (
                <div
                  key={pair.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                  style={{ backgroundColor: '#EBF3FE' }}
                >
                  <span className="text-xs font-semibold w-5 text-center" style={{ color: '#8B95A1' }}>{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold" style={{ color: '#191F28' }}>{p1?.name}</span>
                  <span className="text-xs font-bold" style={{ color: '#3182F6' }}>+</span>
                  <span className="flex-1 text-sm font-semibold" style={{ color: '#191F28' }}>{p2?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 개인 참가자 목록 */}
      {solos.length > 0 && (
        <div className="rounded-3xl p-5 bg-white flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#F2F4F6', color: '#6B7684' }}
            >
              🎲 랜덤 배정
            </span>
            <span className="text-xs" style={{ color: '#8B95A1' }}>{solos.length}명 → {soloTeams}팀</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {solos.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#F2F4F6', color: '#191F28' }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 rounded-2xl text-sm font-semibold"
          style={{ backgroundColor: '#F2F4F6', color: '#4E5968', border: 'none', cursor: 'pointer' }}
        >
          수정하기
        </button>
        <button
          type="button"
          onClick={onGenerate}
          className="flex-1 h-12 rounded-2xl text-sm font-bold"
          style={{
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
          }}
        >
          팀 구성 시작
        </button>
      </div>
    </div>
  );
}
