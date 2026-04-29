import type { Player, PrePair, PairedTeam } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeRandomTeams(players: Player[], prePairs: PrePair[]): PairedTeam[] {
  const teams: PairedTeam[] = [];
  let teamNumber = 1;

  const playerMap = new Map(players.map((p) => [p.id, p]));
  const usedIds = new Set<string>();

  // 사전 팀 먼저
  for (const pair of prePairs) {
    const p1 = playerMap.get(pair.p1Id);
    const p2 = playerMap.get(pair.p2Id);
    if (p1 && p2) {
      teams.push({ teamNumber: teamNumber++, players: [p1, p2], isPreFormed: true });
      usedIds.add(p1.id);
      usedIds.add(p2.id);
    }
  }

  // 나머지 솔로 랜덤 페어링
  const solos = shuffle(players.filter((p) => !usedIds.has(p.id)));
  for (let i = 0; i < solos.length; i += 2) {
    if (i + 1 < solos.length) {
      teams.push({ teamNumber: teamNumber++, players: [solos[i], solos[i + 1]], isPreFormed: false });
    } else {
      // 홀수 남은 경우 마지막 팀에 추가
      const last = teams[teams.length - 1];
      if (last) (last.players as Player[]).push(solos[i]);
    }
  }

  return teams;
}
