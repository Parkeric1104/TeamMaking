import { useEffect, useState } from 'react';

interface Props {
  names: string[];
  onDone: () => void;
}

const MESSAGES = [
  '참가자를 섞고 있어요...',
  '최적의 조합을 찾고 있어요...',
  '팀을 구성하고 있어요...',
  '거의 다 됐어요!',
];

const PALETTE = ['#3182F6', '#FF6B6B', '#26DE81', '#FFCA28', '#9B59B6', '#FF9F43', '#00B4D8', '#4361EE'];

export default function GeneratingStep({ names, onDone }: Props) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cards, setCards] = useState(() =>
    names.slice(0, 8).map((name, i) => ({
      name,
      color: PALETTE[i % PALETTE.length],
      x: Math.random() * 60 + 20,
      y: Math.random() * 40 + 30,
      rotate: Math.random() * 30 - 15,
    }))
  );

  // 메시지 순환
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 600);
    return () => clearInterval(id);
  }, []);

  // 프로그레스 바
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(id);
  }, []);

  // 카드 셔플 애니메이션
  useEffect(() => {
    const id = setInterval(() => {
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          x: Math.random() * 60 + 20,
          y: Math.random() * 40 + 30,
          rotate: Math.random() * 30 - 15,
        }))
      );
    }, 500);
    return () => clearInterval(id);
  }, []);

  // 완료 후 전환
  useEffect(() => {
    const id = setTimeout(onDone, 2200);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* 카드 셔플 영역 */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ height: 200, backgroundColor: '#F2F4F6' }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="absolute px-3 py-1.5 rounded-xl text-sm font-bold text-white"
            style={{
              left: `${card.x}%`,
              top: `${card.y}%`,
              transform: `translate(-50%, -50%) rotate(${card.rotate}deg)`,
              backgroundColor: card.color,
              transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
              zIndex: i,
            }}
          >
            {card.name}
          </div>
        ))}

        {/* 중앙 스피너 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="w-16 h-16 rounded-full border-4 border-white"
            style={{
              borderTopColor: '#3182F6',
              animation: 'spin 0.8s linear infinite',
              opacity: 0.7,
            }}
          />
        </div>
      </div>

      {/* 메시지 */}
      <div className="text-center">
        <p
          className="text-base font-bold"
          style={{ color: '#191F28', transition: 'opacity 0.3s' }}
          key={msgIdx}
        >
          {MESSAGES[msgIdx]}
        </p>
        <p className="text-xs mt-1" style={{ color: '#8B95A1' }}>
          {names.length}명의 참가자를 배정하는 중
        </p>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: '#E5E8EB' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: '#3182F6',
            transition: 'width 0.08s linear',
          }}
        />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
