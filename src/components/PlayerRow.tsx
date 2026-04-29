import type { Player } from '../types';
import RatingStars from './RatingStars';

interface Props {
  player: Player;
  index: number;
  onUpdate: (id: string, field: keyof Player, value: string | number) => void;
  onRemove: (id: string) => void;
}

export default function PlayerRow({ player, index, onUpdate, onRemove }: Props) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl bg-white"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <span
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ backgroundColor: '#F2F4F6', color: '#8B95A1' }}
      >
        {index + 1}
      </span>

      <input
        type="text"
        placeholder="이름 입력"
        value={player.name}
        maxLength={10}
        onChange={(e) => onUpdate(player.id, 'name', e.target.value)}
        className="flex-1 text-sm font-medium bg-transparent"
        style={{ border: 'none', color: '#191F28', minWidth: 0 }}
      />

      <RatingStars value={player.rating} onChange={(v) => onUpdate(player.id, 'rating', v)} />

      <button
        type="button"
        onClick={() => onRemove(player.id)}
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#F2F4F6', border: 'none', cursor: 'pointer' }}
        aria-label="삭제"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="#8B95A1" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
