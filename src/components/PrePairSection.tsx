import { useState } from 'react';
import type { Player, PrePair } from '../types';

interface Props {
  players: Player[];
  prePairs: PrePair[];
  onAdd: (p1Id: string, p2Id: string) => void;
  onRemove: (id: string) => void;
}

export default function PrePairSection({ players, prePairs, onAdd, onRemove }: Props) {
  const [sel1, setSel1] = useState('');
  const [sel2, setSel2] = useState('');

  const pairedIds = new Set(prePairs.flatMap((p) => [p.p1Id, p.p2Id]));
  const namedPlayers = players.filter((p) => p.name.trim());

  // 각 셀렉트에서 상대방이 선택한 것 + 이미 쌍인 것은 제외
  const options1 = namedPlayers.filter((p) => !pairedIds.has(p.id) && p.id !== sel2);
  const options2 = namedPlayers.filter((p) => !pairedIds.has(p.id) && p.id !== sel1);

  const canAdd = sel1 && sel2 && sel1 !== sel2;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(sel1, sel2);
    setSel1('');
    setSel2('');
  };

  const getName = (id: string) => players.find((p) => p.id === id)?.name ?? '';

  return (
    <div className="flex flex-col gap-3">
      {/* 등록된 사전 팀 목록 */}
      {prePairs.length > 0 && (
        <div className="flex flex-col gap-2">
          {prePairs.map((pair, i) => (
            <div
              key={pair.id}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
              style={{ backgroundColor: '#EBF3FE' }}
            >
              <span className="text-xs font-semibold w-5 text-center" style={{ color: '#8B95A1' }}>
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-semibold" style={{ color: '#191F28' }}>
                {getName(pair.p1Id)}
              </span>
              <span className="text-xs font-bold px-1.5" style={{ color: '#3182F6' }}>+</span>
              <span className="flex-1 text-sm font-semibold" style={{ color: '#191F28' }}>
                {getName(pair.p2Id)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(pair.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#D1E4FC', border: 'none', cursor: 'pointer' }}
                aria-label="삭제"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#3182F6" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 새 사전 팀 추가 폼 */}
      {namedPlayers.filter((p) => !pairedIds.has(p.id)).length >= 2 ? (
        <div className="flex items-center gap-2">
          <select
            value={sel1}
            onChange={(e) => setSel1(e.target.value)}
            className="flex-1 h-10 rounded-xl text-sm px-2"
            style={{
              border: '1.5px solid #E5E8EB',
              color: sel1 ? '#191F28' : '#8B95A1',
              backgroundColor: 'white',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238B95A1' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '28px',
            }}
          >
            <option value="">참가자 선택</option>
            {options1.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <span className="text-sm font-bold flex-shrink-0" style={{ color: '#3182F6' }}>+</span>

          <select
            value={sel2}
            onChange={(e) => setSel2(e.target.value)}
            className="flex-1 h-10 rounded-xl text-sm px-2"
            style={{
              border: '1.5px solid #E5E8EB',
              color: sel2 ? '#191F28' : '#8B95A1',
              backgroundColor: 'white',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238B95A1' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '28px',
            }}
          >
            <option value="">참가자 선택</option>
            {options2.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="flex-shrink-0 h-10 px-3 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: canAdd ? '#3182F6' : '#E5E8EB',
              color: canAdd ? 'white' : '#B0B8C1',
              border: 'none',
              cursor: canAdd ? 'pointer' : 'not-allowed',
            }}
          >
            추가
          </button>
        </div>
      ) : (
        <p className="text-xs text-center py-2" style={{ color: '#B0B8C1' }}>
          {namedPlayers.length < 2
            ? '참가자를 2명 이상 입력해주세요'
            : '모든 참가자가 사전 팀으로 배정됐어요'}
        </p>
      )}
    </div>
  );
}
