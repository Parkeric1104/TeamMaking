import { useRef, useState } from 'react';
import type { Player, PrePair } from '../types';
import { parseExcel } from '../utils/excel';

interface Props {
  onImport: (players: Player[], prePairs: PrePair[], randomTeamNames: string[]) => void;
}

export default function ExcelImport({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (file: File) => {
    setError('');
    setLoading(true);
    try {
      const { players, prePairs, randomTeamNames } = await parseExcel(file);
      onImport(players, prePairs, randomTeamNames);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handle(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl cursor-pointer"
        style={{
          border: `1.5px dashed ${dragging ? '#3182F6' : '#D1D6DB'}`,
          backgroundColor: dragging ? '#EBF3FE' : '#F9FAFB',
          transition: 'all 0.15s',
          cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? (
          <div className="w-7 h-7 rounded-full border-2 border-gray-200"
            style={{ borderTopColor: '#3182F6', animation: 'spin 0.8s linear infinite' }} />
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="20" height="20" rx="4" fill={dragging ? '#3182F6' : '#E5E8EB'} />
            <path d="M9 14H19M14 9V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <p className="text-sm font-semibold" style={{ color: dragging ? '#3182F6' : '#4E5968' }}>
          {loading ? '파일 읽는 중...' : '엑셀 파일 드래그 또는 클릭'}
        </p>
        <p className="text-xs" style={{ color: '#8B95A1' }}>
          .xlsx · .xls · .csv 지원
        </p>
      </div>

      {error && (
        <p className="text-xs text-center whitespace-pre-line" style={{ color: '#FF6B6B' }}>{error}</p>
      )}

      <div className="px-3 py-2.5 rounded-xl flex flex-col gap-2" style={{ backgroundColor: '#F2F4F6' }}>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#6B7684' }}>시트 1 · 참가자 목록</p>
          <div className="grid grid-cols-2 gap-1">
            {[['A열', '이름 (필수)'], ['B열', '팀이름 (선택)']].map(([col, desc]) => (
              <div key={col} className="flex items-center gap-1">
                <span className="text-xs font-bold" style={{ color: '#3182F6' }}>{col}</span>
                <span className="text-xs" style={{ color: '#8B95A1' }}>{desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: '#8B95A1' }}>
            팀이름이 같은 두 사람은 자동으로 한 팀이 돼요
          </p>
        </div>
        <div style={{ borderTop: '1px solid #E5E8EB', paddingTop: 6 }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#6B7684' }}>시트 2 · 랜덤 팀이름 목록</p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold" style={{ color: '#3182F6' }}>A열</span>
            <span className="text-xs" style={{ color: '#8B95A1' }}>랜덤 배정 팀이름</span>
          </div>
        </div>
      </div>

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileChange} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
