import type { Player, Team } from '../types';

/** 최고 점수와 최저 점수 팀의 차이를 최소화하는 그리디 배분 */
export function balanceTeams(players: Player[], numTeams: number): Team[] {
  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: i + 1,
    players: [],
    totalRating: 0,
  }));

  // 뱀 순서(snake draft): 1→N→1→N→... 로 배분해 자연스럽게 균형
  let direction = 1;
  let idx = 0;

  for (const player of sorted) {
    teams[idx].players.push(player);
    teams[idx].totalRating += player.rating;
    idx += direction;
    if (idx >= numTeams) { idx = numTeams - 1; direction = -1; }
    else if (idx < 0)     { idx = 0;            direction = 1;  }
  }

  return teams;
}
