import * as XLSX from 'xlsx';
import type { Player, PrePair } from '../types';

const NAME_KEYS = ['이름', 'name', 'Name', 'NAME', '참가자', '성명', '선수명', '성함'];
const TEAM_KEYS = ['TeamName', 'teamName', 'team_name', '팀이름', '팀 이름', '팀명', '사전팀', '사전 팀', '팀', 'preteam', 'pre_team', 'team', 'Team', '그룹'];
const RANDOM_TEAM_HEADER_KEYS = ['RandomTeamName', 'randomteamname', 'TeamName', 'teamname', '랜덤팀이름', '팀이름', '팀명'];

function findKey(obj: Record<string, unknown>, candidates: string[]): string | undefined {
  return candidates.find((k) => k in obj);
}

export interface ExcelResult {
  players: Player[];
  prePairs: PrePair[];
  randomTeamNames: string[];
}

export function parseExcel(file: File): Promise<ExcelResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });

        /* ── 시트 1: 참가자 & 사전팀 ── */
        const ws1 = wb.Sheets[wb.SheetNames[0]];
        type RawRow = { name: string; teamName: string };
        let rawRows: RawRow[] = [];

        const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws1, { defval: '' });

        if (jsonRows.length > 0) {
          const firstRow = jsonRows[0];
          const nameKey = findKey(firstRow, NAME_KEYS);
          const teamKey = findKey(firstRow, TEAM_KEYS);

          if (nameKey) {
            rawRows = jsonRows.map((row) => ({
              name: String(row[nameKey] ?? '').trim(),
              teamName: teamKey ? String(row[teamKey] ?? '').trim() : '',
            }));
          }
        }

        if (rawRows.length === 0) {
          // 헤더 없음: 첫 열 = 이름, 둘째 열 = 팀이름
          const arr = XLSX.utils.sheet_to_json<unknown[]>(ws1, { header: 1 }) as unknown[][];
          rawRows = arr.map((row) => ({
            name: String(row[0] ?? '').trim(),
            teamName: String(row[1] ?? '').trim(),
          }));
        }

        // 헤더 행 제거
        if (rawRows.length > 0 && NAME_KEYS.includes(rawRows[0].name)) {
          rawRows = rawRows.slice(1);
        }

        const filtered = rawRows.filter((r) => r.name);

        if (filtered.length === 0) {
          reject(new Error('참가자 이름을 찾을 수 없어요.\nA열에 이름, B열에 팀이름(선택)을 입력해주세요.'));
          return;
        }

        // Player 생성
        const players: Player[] = filtered.map((r) => ({
          id: crypto.randomUUID() as string,
          name: r.name,
        }));

        // 사전팀 그룹핑: 같은 팀이름을 가진 플레이어를 2인씩 페어로
        const prePairs: PrePair[] = [];
        const teamGroups = new Map<string, Player[]>();
        filtered.forEach((r, i) => {
          if (!r.teamName) return;
          const group = teamGroups.get(r.teamName) ?? [];
          group.push(players[i]);
          teamGroups.set(r.teamName, group);
        });
        for (const [teamName, group] of teamGroups.entries()) {
          for (let i = 0; i + 1 < group.length; i += 2) {
            prePairs.push({
              id: crypto.randomUUID() as string,
              p1Id: group[i].id,
              p2Id: group[i + 1].id,
              teamName,
            });
          }
        }

        /* ── 시트 2: 랜덤 팀이름 ── */
        let randomTeamNames: string[] = [];
        if (wb.SheetNames.length >= 2) {
          const ws2 = wb.Sheets[wb.SheetNames[1]];
          const arr = XLSX.utils.sheet_to_json<unknown[]>(ws2, { header: 1 }) as unknown[][];
          const allNames = arr.map((row) => String(row[0] ?? '').trim()).filter(Boolean);
          // 첫 행이 헤더면 제거
          const headerSkip = allNames.length > 0 &&
            (NAME_KEYS.includes(allNames[0]) || RANDOM_TEAM_HEADER_KEYS.includes(allNames[0]));
          randomTeamNames = headerSkip ? allNames.slice(1) : allNames;
        }

        resolve({ players, prePairs, randomTeamNames });
      } catch (err) {
        console.error('Excel parse error:', err);
        reject(new Error('파일을 읽을 수 없어요. xlsx, xls, csv 형식을 확인해주세요.'));
      }
    };

    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
}
