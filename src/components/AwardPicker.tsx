import { useEffect } from 'react';
import type { Award } from '../types';
import { PRESET_AWARDS } from '../types';

interface Props {
  teamNumber: number;
  current: Award | null;
  onSelect: (award: Award | null) => void;
  onClose: () => void;
}

export default function AwardPicker({ teamNumber, current, onSelect, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6 pb-8 flex flex-col gap-4"
        style={{ backgroundColor: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-base font-bold" style={{ color: '#191F28' }}>
            팀 {teamNumber} 시상
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: '#F2F4F6', border: 'none', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PRESET_AWARDS.map((award) => {
            const isSelected = current?.label === award.label;
            return (
              <button
                key={award.label}
                type="button"
                onClick={() => { onSelect(isSelected ? null : award); onClose(); }}
                className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl"
                style={{
                  backgroundColor: isSelected ? award.bg : '#F2F4F6',
                  border: isSelected ? `2px solid ${award.color}` : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 28 }}>{award.emoji}</span>
                <span className="text-xs font-bold" style={{ color: isSelected ? award.color : '#4E5968' }}>
                  {award.label}
                </span>
              </button>
            );
          })}
        </div>

        {current && (
          <button
            type="button"
            onClick={() => { onSelect(null); onClose(); }}
            className="w-full h-11 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: '#FFF0F0', color: '#E53E3E', border: 'none', cursor: 'pointer' }}
          >
            시상 취소
          </button>
        )}
      </div>
    </div>
  );
}
