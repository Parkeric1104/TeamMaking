import { useState, useEffect, useRef } from 'react';

type Tab = 'home' | 'diary' | 'photos' | 'guestbook';
type SkinKey = 'blue' | 'pink' | 'green' | 'yellow';

interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  mood: string;
  comments: number;
}

interface GuestEntry {
  id: number;
  author: string;
  message: string;
  date: string;
  icon: string;
}

const DIARY: DiaryEntry[] = [
  { id: 1, date: '2004.03.15', title: '오늘 날씨 너무 좋다ㅎㅎ', content: '학교 끝나고 친구들이랑 롯데리아 갔다ㅋㅋ 감자튀김 1+1이라서 존맛ㅠㅠ 오늘 진짜 행복했음. 내일도 이런 날이었으면 좋겠다~ 아 그리고 버스에서 우리반 이***이 탔는데 못 본 척 했다 ㅋㅋㅋ 창피해서ㅠ', mood: '😊', comments: 7 },
  { id: 2, date: '2004.03.10', title: '수학 시험 망했다...ㅠ', content: '아 진짜ㅠㅠㅠ 수학 완전 망했어 점수 나오면 엄마한테 혼날 것 같아서 무서워 죽겠음... 다음엔 진짜 진짜 열심히 해야지!! 다음 시험까지 수학의 정석 다 풀 거임 (과연...ㅋ)', mood: '😢', comments: 4 },
  { id: 3, date: '2004.03.05', title: '버터플라이 클론 ㄹㅇ 명곡', content: 'BGM 새로 바꿨어~ 클론 버터플라이!! 진짜 들을수록 좋음ㅠㅠ 이 노래 들으면 왜인지 모르게 설레... 요즘 계속 이것만 들음ㅋㅋ 다들 들어봐!!', mood: '🎵', comments: 12 },
  { id: 4, date: '2004.02.28', title: '미니룸 새로 꾸밈!!', content: '도토리 모아서 새 벽지랑 바닥재 샀어ㅋㅋ 너무 예쁘다ㅠㅠ 소영언니가 도토리 10개 선물해줬는데 감동... 다들 미니룸 구경 와라~!!', mood: '🏠', comments: 9 },
];

const GUESTBOOK: GuestEntry[] = [
  { id: 1, author: '하늘별♡', message: '일촌 신청했어요~ 자주 놀러올게욤ㅎㅎ 미니미 너무 귀여워ㅠㅠ', date: '2004.03.14', icon: '⭐' },
  { id: 2, author: '민준이★', message: '오늘 학교서 봤는데 왜 모른척 했어ㅋㅋㅋ 나 섭섭했잖아ㅋㅋ', date: '2004.03.12', icon: '🎮' },
  { id: 3, author: '소영언니', message: '미니홈피 꾸미기 진짜 잘했다ㅠㅠ 벽지 어디서 샀어? 나도 사고싶어', date: '2004.03.10', icon: '🌸' },
  { id: 4, author: '준호형', message: '야 나 일촌이야? 아닌 것 같은데ㅋㅋ 신청할게~ 허락해줘', date: '2004.03.08', icon: '🎵' },
  { id: 5, author: '달빛소녀', message: '우와 스킨 예쁘다!! 어디 스킨이야?? 알려줘ㅠ', date: '2004.03.07', icon: '🌙' },
];

const PHOTOS = [
  { id: 1, emoji: '🌸', title: '봄 나들이', count: 8 },
  { id: 2, emoji: '🎂', title: '내 생일파티', count: 12 },
  { id: 3, emoji: '🏖️', title: '여름 가족여행', count: 23 },
  { id: 4, emoji: '🎃', title: '할로윈', count: 5 },
  { id: 5, emoji: '⛄', title: '눈 온 날', count: 7 },
  { id: 6, emoji: '🎄', title: '크리스마스', count: 11 },
];

const SKINS: Record<SkinKey, { bg: string; accent: string; sidebar: string; header: string; tabBg: string; text: string }> = {
  blue: { bg: '#daeaf7', accent: '#4a90d9', sidebar: '#c0ddf0', header: '#2563a8', tabBg: '#eef5fb', text: '#1a3d6b' },
  pink: { bg: '#fde8f0', accent: '#d63384', sidebar: '#f9c6d8', header: '#9b1155', tabBg: '#fef0f6', text: '#6b0f33' },
  green: { bg: '#d9f0e0', accent: '#2e9e55', sidebar: '#b8e0c5', header: '#1a6b38', tabBg: '#edf8f0', text: '#0f4021' },
  yellow: { bg: '#fef3d0', accent: '#d4900a', sidebar: '#fde8a0', header: '#a36200', tabBg: '#fffaed', text: '#5c3800' },
};

const FRIENDS = ['하늘별♡', '민준이★', '소영언니', '준호형', '달빛소녀', '철수야', '영희짱', '재민이'];

function VisitorTicker({ n }: { n: number }) {
  return (
    <span className="inline-flex">
      {String(n).padStart(6, '0').split('').map((d, i) => (
        <span key={i} style={{ display: 'inline-block', background: '#222', color: '#0f0', padding: '0 2px', fontFamily: 'monospace', fontSize: 11, lineHeight: '16px', margin: '0 0.5px', borderRadius: 2 }}>{d}</span>
      ))}
    </span>
  );
}

export function Minihompy({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('home');
  const [skin, setSkin] = useState<SkinKey>('blue');
  const [bgmOn, setBgmOn] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [guests, setGuests] = useState<GuestEntry[]>(GUESTBOOK);
  const [newAuthor, setNewAuthor] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [todayVisit] = useState(23);
  const [totalVisit] = useState(1847);
  const [dotori] = useState(32);
  const [ilchon] = useState(FRIENDS.length);
  const bgmRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [bgmNote, setBgmNote] = useState(0);
  const notes = ['♩', '♪', '♫', '♬'];

  const theme = SKINS[skin];

  useEffect(() => {
    if (bgmOn) {
      bgmRef.current = setInterval(() => setBgmNote(n => (n + 1) % 4), 500);
    } else {
      if (bgmRef.current) clearInterval(bgmRef.current);
    }
    return () => { if (bgmRef.current) clearInterval(bgmRef.current); };
  }, [bgmOn]);

  const addGuest = () => {
    if (!newAuthor.trim() || !newMsg.trim()) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    setGuests(prev => [{ id: Date.now(), author: newAuthor.trim(), message: newMsg.trim(), date: dateStr, icon: '😊' }, ...prev]);
    setNewAuthor('');
    setNewMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto"
      style={{ background: theme.bg, fontFamily: '"Dotum", "돋움", "굴림", "Gulim", Arial, sans-serif', fontSize: 12 }}
    >
      {/* ── 상단 헤더 ── */}
      <div style={{ background: `linear-gradient(180deg, ${theme.header} 0%, ${theme.accent} 100%)`, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} className="w-full">
        <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18, letterSpacing: 2, textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
              Cy<span style={{ color: '#ffe066' }}>★</span>World
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>미니홈피</span>
          </div>

          {/* BGM + 스킨 + 닫기 */}
          <div className="flex items-center gap-2">
            {/* BGM 플레이어 */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 4, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setBgmOn(b => !b)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 12, padding: 0 }}>
                {bgmOn ? '⏸' : '▶'}
              </button>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, maxWidth: 110, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {bgmOn ? <span>{notes[bgmNote]} </span> : null}버터플라이 - 클론
              </span>
            </div>

            {/* 스킨 선택 */}
            <div className="flex items-center gap-1">
              {(Object.keys(SKINS) as SkinKey[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSkin(s)}
                  style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: SKINS[s].accent,
                    border: skin === s ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer', padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              style={{ background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', color: 'white', fontSize: 11, padding: '3px 8px', borderRadius: 4 }}
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      </div>

      {/* ── 메인 레이아웃 ── */}
      <div className="max-w-3xl mx-auto px-3 pt-4 pb-12 flex gap-3">

        {/* ── 왼쪽 사이드바 ── */}
        <div style={{ width: 150, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>

          {/* 미니미 + 프로필 */}
          <div style={{ background: 'white', border: `2px solid ${theme.accent}`, borderRadius: 6, padding: '10px 8px', textAlign: 'center' }}>
            {/* 미니미 캐릭터 */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 4 }}>
              <div style={{ fontSize: 52, lineHeight: 1 }}>🧑‍💻</div>
              {bgmOn && (
                <div style={{ position: 'absolute', top: -4, right: -8, fontSize: 14, animation: 'none', color: theme.accent }}>
                  {notes[bgmNote]}
                </div>
              )}
            </div>
            <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 13 }}>하늘을날아</div>
            <div style={{ color: '#888', fontSize: 11, marginTop: 1 }}>박대웅</div>
            <div style={{ display: 'inline-block', marginTop: 4, background: theme.sidebar, borderRadius: 10, padding: '2px 8px', fontSize: 10, color: theme.text }}>
              {bgmOn ? '🎵 음악중' : '😊 행복'}
            </div>
          </div>

          {/* 방문자수 */}
          <div style={{ background: 'white', border: `1px solid ${theme.accent}`, borderRadius: 6, padding: '7px 8px' }}>
            <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 11, marginBottom: 5 }}>방문자수</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <span style={{ color: '#666', fontSize: 10 }}>오늘</span>
              <span style={{ color: theme.accent, fontWeight: 'bold', fontSize: 11 }}>{todayVisit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: 10 }}>전체</span>
              <VisitorTicker n={totalVisit} />
            </div>
          </div>

          {/* 도토리 */}
          <div style={{ background: 'white', border: `1px solid ${theme.accent}`, borderRadius: 6, padding: '7px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: theme.text, fontWeight: 'bold' }}>🌰 도토리</span>
            <span style={{ fontSize: 12, color: theme.accent, fontWeight: 'bold' }}>{dotori}개</span>
          </div>

          {/* 네비 메뉴 */}
          <div style={{ background: 'white', border: `1px solid ${theme.accent}`, borderRadius: 6, overflow: 'hidden' }}>
            {(['home', 'diary', 'photos', 'guestbook'] as Tab[]).map((t, i) => {
              const labels = { home: '🏠 홈', diary: '📔 다이어리', photos: '📷 사진첩', guestbook: '📝 방명록' };
              return (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSelectedDiary(null); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 10px', fontSize: 11,
                    fontWeight: tab === t ? 'bold' : 'normal',
                    background: tab === t ? theme.accent : i % 2 === 0 ? 'white' : theme.tabBg,
                    color: tab === t ? 'white' : theme.text,
                    border: 'none', borderBottom: `1px solid ${theme.accent}33`, cursor: 'pointer',
                    display: 'block',
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* 일촌 */}
          <div style={{ background: 'white', border: `1px solid ${theme.accent}`, borderRadius: 6, padding: '7px 8px' }}>
            <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 11, marginBottom: 5 }}>
              💛 일촌 <span style={{ color: theme.accent }}>({ilchon})</span>
            </div>
            {FRIENDS.slice(0, 5).map(name => (
              <div key={name} style={{ fontSize: 10, padding: '2px 0', color: theme.text, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
                {name}
              </div>
            ))}
            <div style={{ fontSize: 10, marginTop: 3, color: theme.accent, cursor: 'pointer', fontWeight: 'bold' }}>
              + {ilchon - 5}명 더보기
            </div>
          </div>
        </div>

        {/* ── 콘텐츠 영역 ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 탭 헤더 */}
          <div style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.header})`, borderRadius: '6px 6px 0 0', padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
              {{ home: '🏠 홈', diary: '📔 다이어리', photos: '📷 사진첩', guestbook: '📝 방명록' }[tab]}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>하늘을날아의 미니홈피</span>
          </div>

          {/* 콘텐츠 박스 */}
          <div style={{ background: 'white', border: `2px solid ${theme.accent}`, borderTop: 'none', borderRadius: '0 0 6px 6px', padding: 16, minHeight: 380 }}>

            {/* ── 홈 ── */}
            {tab === 'home' && (
              <div>
                {/* 웰컴 배너 */}
                <div style={{ background: `linear-gradient(135deg, ${theme.sidebar}, ${theme.tabBg})`, border: `1px solid ${theme.accent}55`, borderRadius: 6, padding: '14px 16px', textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 36, marginBottom: 4 }}>🌸 ✨ 🌸</div>
                  <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 13, marginBottom: 4 }}>
                    하늘을날아의 미니홈피에 오신 걸 환영해요~!!
                  </div>
                  <div style={{ color: '#666', fontSize: 11, lineHeight: 1.7 }}>
                    오늘 하루도 행복하게 ★ 자주 놀러와요 💕<br />
                    일촌 신청은 언제나 환영 :)
                  </div>
                </div>

                {/* 최근 다이어리 */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📔 최근 다이어리</span>
                    <span onClick={() => setTab('diary')} style={{ fontSize: 10, color: theme.accent, cursor: 'pointer', fontWeight: 'normal' }}>전체보기 →</span>
                  </div>
                  {DIARY.slice(0, 3).map(e => (
                    <div
                      key={e.id}
                      onClick={() => { setTab('diary'); setSelectedDiary(e); }}
                      style={{ padding: '6px 0', borderBottom: `1px dashed ${theme.accent}44`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={el => (el.currentTarget.style.background = theme.tabBg)}
                      onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: theme.text, fontSize: 11 }}>{e.mood} {e.title}</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#aaa', fontSize: 10 }}>💬 {e.comments}</span>
                        <span style={{ color: '#aaa', fontSize: 10 }}>{e.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 최근 방명록 */}
                <div>
                  <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📝 최근 방명록</span>
                    <span onClick={() => setTab('guestbook')} style={{ fontSize: 10, color: theme.accent, cursor: 'pointer', fontWeight: 'normal' }}>전체보기 →</span>
                  </div>
                  {guests.slice(0, 3).map(g => (
                    <div key={g.id} style={{ padding: '6px 0', borderBottom: `1px dashed ${theme.accent}44`, fontSize: 11 }}>
                      <span style={{ fontWeight: 'bold', color: theme.accent }}>{g.icon} {g.author}</span>
                      <span style={{ color: '#555', marginLeft: 6 }}>: {g.message.length > 30 ? g.message.slice(0, 30) + '...' : g.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 다이어리 ── */}
            {tab === 'diary' && !selectedDiary && (
              <div>
                <div style={{ color: '#999', fontSize: 10, marginBottom: 10 }}>총 {DIARY.length}개의 일기</div>
                {DIARY.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedDiary(e)}
                    style={{ borderBottom: `1px solid ${theme.accent}33`, padding: '10px 6px', cursor: 'pointer' }}
                    onMouseEnter={el => (el.currentTarget.style.background = theme.tabBg)}
                    onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: theme.header, fontSize: 12 }}>{e.mood} {e.title}</span>
                      </div>
                      <span style={{ color: '#aaa', fontSize: 10, flexShrink: 0, marginLeft: 8 }}>{e.date}</span>
                    </div>
                    <div style={{ color: '#777', fontSize: 11, marginTop: 4, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {e.content}
                    </div>
                    <div style={{ color: '#aaa', fontSize: 10, marginTop: 4 }}>💬 댓글 {e.comments}개</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'diary' && selectedDiary && (
              <div>
                <button
                  onClick={() => setSelectedDiary(null)}
                  style={{ background: 'none', border: `1px solid ${theme.accent}`, borderRadius: 4, cursor: 'pointer', color: theme.accent, fontSize: 11, padding: '3px 10px', marginBottom: 14 }}
                >
                  ← 목록으로
                </button>
                <div style={{ background: theme.tabBg, border: `1px solid ${theme.accent}55`, borderRadius: 6, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 14, marginBottom: 4 }}>
                    {selectedDiary.mood} {selectedDiary.title}
                  </div>
                  <div style={{ color: '#aaa', fontSize: 10, marginBottom: 12 }}>{selectedDiary.date} · 댓글 {selectedDiary.comments}개</div>
                  <div style={{ color: '#444', fontSize: 12, lineHeight: 2 }}>{selectedDiary.content}</div>
                </div>
                <div style={{ color: '#999', fontSize: 11, textAlign: 'center', padding: 10 }}>
                  ─ 댓글 {selectedDiary.comments}개 ─
                </div>
                {[...Array(Math.min(selectedDiary.comments, 3))].map((_, i) => (
                  <div key={i} style={{ padding: '6px 8px', background: theme.tabBg, borderRadius: 4, marginBottom: 4, fontSize: 11 }}>
                    <span style={{ fontWeight: 'bold', color: theme.accent }}>{FRIENDS[i]}</span>
                    <span style={{ color: '#555', marginLeft: 8 }}>
                      {['ㅋㅋㅋ 공감ㅠㅠ 나도 그래', '완전 공감... 힘내!!', '역시 너답다ㅋㅋ'][i]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── 사진첩 ── */}
            {tab === 'photos' && (
              <div>
                <div style={{ color: '#999', fontSize: 10, marginBottom: 12 }}>앨범 {PHOTOS.length}개</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {PHOTOS.map(album => (
                    <div
                      key={album.id}
                      style={{ border: `2px solid ${theme.accent}55`, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: theme.tabBg }}
                      onMouseEnter={el => (el.currentTarget.style.borderColor = theme.accent)}
                      onMouseLeave={el => (el.currentTarget.style.borderColor = `${theme.accent}55`)}
                    >
                      <div style={{ background: theme.sidebar, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                        {album.emoji}
                      </div>
                      <div style={{ padding: '6px 8px' }}>
                        <div style={{ fontWeight: 'bold', color: theme.text, fontSize: 11 }}>{album.title}</div>
                        <div style={{ color: '#aaa', fontSize: 10, marginTop: 2 }}>사진 {album.count}장</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 16, color: '#aaa', fontSize: 11 }}>
                  클릭하면 앨범을 볼 수 있어요 📷
                </div>
              </div>
            )}

            {/* ── 방명록 ── */}
            {tab === 'guestbook' && (
              <div>
                {/* 입력 폼 */}
                <div style={{ background: theme.sidebar, border: `1px solid ${theme.accent}55`, borderRadius: 6, padding: 12, marginBottom: 14 }}>
                  <div style={{ fontWeight: 'bold', color: theme.header, fontSize: 11, marginBottom: 8 }}>✏️ 방명록 남기기</div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      placeholder="이름 (닉네임)"
                      style={{ flex: 1, fontSize: 11, border: `1px solid ${theme.accent}`, borderRadius: 4, padding: '4px 8px', outline: 'none' }}
                    />
                  </div>
                  <textarea
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addGuest(); }}
                    placeholder="방명록을 남겨주세요~ (Ctrl+Enter로 등록)"
                    rows={2}
                    style={{ width: '100%', fontSize: 11, border: `1px solid ${theme.accent}`, borderRadius: 4, padding: '4px 8px', resize: 'none', boxSizing: 'border-box', outline: 'none', marginBottom: 6 }}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={addGuest}
                      style={{ background: theme.accent, color: 'white', border: 'none', borderRadius: 4, padding: '5px 16px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      남기기
                    </button>
                  </div>
                </div>

                <div style={{ color: '#999', fontSize: 10, marginBottom: 8 }}>총 {guests.length}개</div>
                {guests.map(g => (
                  <div key={g.id} style={{ borderBottom: `1px dashed ${theme.accent}44`, padding: '10px 4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 'bold', color: theme.accent, fontSize: 12 }}>{g.icon} {g.author}</span>
                      <span style={{ color: '#aaa', fontSize: 10 }}>{g.date}</span>
                    </div>
                    <div style={{ color: '#444', fontSize: 11, lineHeight: 1.7 }}>{g.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 푸터 */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#aaa', padding: '8px 0 16px', borderTop: `1px solid ${theme.accent}33`, background: 'rgba(255,255,255,0.5)' }}>
        ⓒ 2004 Cyworld Corp. All rights reserved. | 고객센터 1588-0000 | 이용약관 | 개인정보처리방침
      </div>
    </div>
  );
}
