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

// 패턴
const ISO_WITH_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(Z|[+-]\d{2}:\d{2})$/;
const ISO_NO_TZ   = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?$/;
const DB_WITH_SP  = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?$/;

// "타임존 없는" 로컬 문자열을 직접 파싱해서 로컬 Date 생성
const _buildLocal = (y: number, m: number, d: number, hh: number, mm: number, ss: number) =>
  new Date(y, m - 1, d, hh, mm, ss);

// 문자열 → Date (항상 "로컬"로 해석)
const _parseToLocalDate = (s: string): Date | null => {
  const t = s.trim();

  // 1) ISO(+TZ): Z 또는 +09:00 명시 → 표준 파서 사용
  if (ISO_WITH_TZ.test(t)) {
    const d = new Date(t.replace(/\.\d+$/, '')); // 마이크로초 제거
    return isNaN(d.getTime()) ? null : d;
  }

  // 2) DB 포맷 "YYYY-MM-DD HH:mm:ss.ffffff" → 로컬로 직접 파싱
  if (DB_WITH_SP.test(t)) {
    const m = t.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/)!;
    return _buildLocal(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
  }

  // 3) ISO(무타임존) "YYYY-MM-DDTHH:mm[:ss[.fff]]"
  //    ⇢ 서버가 UTC를 타임존 없이 보내는 케이스로 간주하고 UTC로 만들어 로컬로 표시
  if (ISO_NO_TZ.test(t)) {
    const m = t.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)!;
    const utcMs = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
    return new Date(utcMs); // getHours() 하면 로컬로 변환된 시각 나옴 (KST=+9)
  }

  return null;
};

/** 어떤 타입이 와도 "로컬 HH:mm" */
export const toLocalHHmm = (val?: unknown): string => {
  if (val == null) return '';

  if (typeof val === 'number') {
    // 0~47는 슬롯 인덱스
    if (val >= 0 && val <= 47 && timeMapping[val] !== undefined) return timeMapping[val];
    // 그 외 숫자는 timestamp로 간주
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : _hhmm(d);
  }

  if (val instanceof Date) return _hhmm(val);

  const s = String(val);
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