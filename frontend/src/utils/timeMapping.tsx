export const timeMapping: { [key: number]: string } = {
  0: '00:00',
  1: '00:30',
  2: '01:00',
  3: '01:30',
  4: '02:00',
  5: '02:30',
  6: '03:00',
  7: '03:30',
  8: '04:00',
  9: '04:30',
  10: '05:00',
  11: '05:30',
  12: '06:00',
  13: '06:30',
  14: '07:00',
  15: '07:30',
  16: '08:00',
  17: '08:30',
  18: '09:00',
  19: '09:30',
  20: '10:00',
  21: '10:30',
  22: '11:00',
  23: '11:30',
  24: '12:00',
  25: '12:30',
  26: '13:00',
  27: '13:30',
  28: '14:00',
  29: '14:30',
  30: '15:00',
  31: '15:30',
  32: '16:00',
  33: '16:30',
  34: '17:00',
  35: '17:30',
  36: '18:00',
  37: '18:30',
  38: '19:00',
  39: '19:30',
  40: '20:00',
  41: '20:30',
  42: '21:00',
  43: '21:30',
  44: '22:00',
  45: '22:30',
  46: '23:00',
  47: '23:30',
};
const _pad2 = (n: number) => String(n).padStart(2, '0');
const _hhmm = (d: Date) => `${_pad2(d.getHours())}:${_pad2(d.getMinutes())}`;

// 패턴 (안전/포괄적으로 보강)
const ISO_WITH_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(Z|[+-]\d{2}:\d{2})$/;
// 캡처 가능한 패턴으로 통일 (초/마이크로초 옵션)
const ISO_NO_TZ_CAP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,6})?)?$/;
const DB_WITH_SP_CAP  = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?$/;

// "타임존 없는" 로컬 문자열을 직접 파싱해서 로컬 Date 생성
const _buildLocal = (y: number, m: number, d: number, hh: number, mm: number, ss: number) =>
  new Date(y, m - 1, d, hh, mm, ss);

// 문자열 → Date (항상 "로컬"로 해석)
const _parseToLocalDate = (s: string): Date | null => {
  const t = s.trim();
  if (!t) return null;

  // 1) ISO(+TZ): Z 또는 +09:00 명시 → 표준 파서 사용
  if (ISO_WITH_TZ.test(t)) {
    // 마이크로초가 있을 수 있어 약간 정리
    const cleaned = t.replace(/(\.\d{1,6})(?=(Z|[+-]\d{2}:\d{2})$)/, '');
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }

  // 2) DB 포맷 "YYYY-MM-DD HH:mm:ss[.ffffff]" → 로컬로 직접 파싱
  const db = t.match(DB_WITH_SP_CAP);
  if (db) {
    const [, y, mo, day, hh, mm, ss] = db;
    return _buildLocal(+y, +mo, +day, +hh, +mm, +ss);
  }

  // 3) ISO(무타임존) "YYYY-MM-DDTHH:mm[:ss[.fff]]"
  const isoNoTz = t.match(ISO_NO_TZ_CAP);
  if (isoNoTz) {
    const [, y, mo, day, hh, mm, ss] = isoNoTz;
    const utcMs = Date.UTC(+y, +mo - 1, +day, +hh, +mm, +(ss ?? 0));
    return new Date(utcMs); // 로컬 표시 시 자동 변환
  }

  return null;
};

/** 어떤 타입이 와도 "로컬 HH:mm" */
export const toLocalHHmm = (val?: unknown): string => {
  if (val == null) return '';

  // 숫자: 슬롯(0~47) 또는 epoch ms
  if (typeof val === 'number') {
    if (val >= 0 && val <= 47 && timeMapping[val] !== undefined) return timeMapping[val];
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : _hhmm(d);
  }

  if (val instanceof Date) return _hhmm(val);

  const s = String(val).trim();
  if (!s) return '';

  // "숫자 문자열": 슬롯 우선, 아니면 epoch ms로 시도
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (n >= 0 && n <= 47 && timeMapping[n] !== undefined) return timeMapping[n];
    // epoch ms로 충분히 큰 수만 Date 시도 (길이 11자리 이상 가이드)
    if (s.length >= 11) {
      const d = new Date(n);
      if (!isNaN(d.getTime())) return _hhmm(d);
    }
    return ''; // 그 외 숫자 문자열은 처리 불가 → 빈 문자열
  }

  // 날짜 문자열 파싱 시도
  const d = _parseToLocalDate(s);
  if (d) return _hhmm(d);

  // 마지막 안전망: 문자열 안의 HH:mm 그대로 사용
  const m = s.match(/\b(\d{2}):(\d{2})\b/);
  return m ? `${m[1]}:${m[2]}` : '';
};

/** 시작/끝/슬롯로 "HH:mm - HH:mm" 생성 */
export const toTimeRange = (
  startLike?: unknown,
  endLike?: unknown,
  slotLike?: number | string
): string => {
  const a = toLocalHHmm(startLike);
  const b = toLocalHHmm(endLike);

  if (a && b) return `${a} - ${b}`;
  if (a || b) return [a, b].filter(Boolean).join(' - ');

  if (slotLike !== undefined && String(slotLike).match(/^\d+$/)) {
    const i = Number(slotLike);
    const s = timeMapping[i];
    const e = timeMapping[i + 1];
    if (s && e) return `${s} - ${e}`;
  }
  return '';
};