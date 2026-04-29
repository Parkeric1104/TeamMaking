import type { Player } from '../types';

interface Props {
  player: Player;
  index: number;
  isPaired: boolean;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function PlayerRow({ player, index, isPaired, onUpdate, onRemove }: Props) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ backgroundColor: '#F2F4F6', color: '#8B95A1' }}
      >
        {index + 1}
      </span>

      <input
        type="text"
        placeholder="이름 입력"
        value={player.name}
        maxLength={10}
        onChange={(e) => onUpdate(player.id, e.target.value)}
        className="flex-1 text-sm font-medium bg-transparent"
        style={{ border: 'none', color: '#191F28', minWidth: 0 }}
      />

      {isPaired && (
        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#EBF3FE', color: '#3182F6' }}>
          사전팀
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(player.id)}
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#F2F4F6', border: 'none', cursor: 'pointer' }}
        aria-label="삭제"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L11 11M11 1L1 11" stroke="#8B95A1" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
