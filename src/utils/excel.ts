import * as XLSX from 'xlsx';
import type { Player, PrePair } from '../types';

const NAME_KEYS = ['이름', 'name', 'Name', 'NAME', '참가자', '성명', '선수명', '성함'];
const TEAM_KEYS = ['사전팀', '사전 팀', '팀', 'preteam', 'pre_team', 'team', 'Team', '그룹'];

function findKey(obj: Record<string, unknown>, candidates: string[]): string | undefined {
  return candidates.find((k) => k in obj);
}

export interface ExcelResult {
  players: Player[];
  prePairs: PrePair[];
}

export function parseExcel(file: File): Promise<ExcelResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];

        type RawRow = { name: string; teamId: string };
        let rawRows: RawRow[] = [];

        const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

        if (jsonRows.length > 0) {
          const firstRow = jsonRows[0];
          const nameKey = findKey(firstRow, NAME_KEYS);
          const teamKey = findKey(firstRow, TEAM_KEYS);

          if (nameKey) {
            rawRows = jsonRows.map((row) => ({
              name: String(row[nameKey] ?? '').trim(),
              teamId: teamKey ? String(row[teamKey] ?? '').trim() : '',
            }));
          }
        }

        if (rawRows.length === 0) {
          // 헤더 없음: 첫 열 = 이름, 둘째 열 = 사전팀
          const arr = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][];
          rawRows = arr.map((row) => ({
            name: String(row[0] ?? '').trim(),
            teamId: String(row[1] ?? '').trim(),
          }));
        }

        // 헤더 행 제거 (첫 번째가 '이름' 등 키워드면)
        if (rawRows.length > 0 && NAME_KEYS.includes(rawRows[0].name)) {
          rawRows = rawRows.slice(1);
        }

        const filtered = rawRows.filter((r) => r.name);

        if (filtered.length === 0) {
          reject(new Error('참가자 이름을 찾을 수 없어요.\nA열에 이름, B열에 사전팀 번호(선택)를 입력해주세요.'));
          return;
        }

        // Player 생성
        const players: Player[] = filtered.map((r) => ({
          id: crypto.randomUUID() as string,
          name: r.name,
        }));

        // 사전팀 그룹핑: 같은 teamId를 가진 플레이어를 2인씩 페어로
        const prePairs: PrePair[] = [];
        const teamGroups = new Map<string, Player[]>();
        filtered.forEach((r, i) => {
          if (!r.teamId) return;
          const group = teamGroups.get(r.teamId) ?? [];
          group.push(players[i]);
          teamGroups.set(r.teamId, group);
        });
        for (const group of teamGroups.values()) {
          for (let i = 0; i + 1 < group.length; i += 2) {
            prePairs.push({ id: crypto.randomUUID() as string, p1Id: group[i].id, p2Id: group[i + 1].id });
          }
        }

        resolve({ players, prePairs });
      } catch (err) {
        console.error('Excel parse error:', err);
        reject(new Error('파일을 읽을 수 없어요. xlsx, xls, csv 형식을 확인해주세요.'));
      }
    };

    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
}
