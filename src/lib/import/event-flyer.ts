/**
 * Движок афиши: текст поста/флаера → черновик события.
 *
 * Чистый парсер без сети и БД: вытаскивает из свободного текста только
 * ФАКТЫ (дата/время/цена/возраст/запись) и честно перечисляет, что нашёл,
 * в notes. Ничего не выдумывает: не нашёл — null. Заголовок — только
 * КАНДИДАТ (первая содержательная строка), решает человек. Тон и описание —
 * всегда ручные: это ценность гида, а не парсера.
 *
 * Даты без года трактуются как ближайшее будущее в часовом поясе Паттайи:
 * афиши анонсируют предстоящее. Референс времени передаётся параметром
 * (тестируемость), никакого Date.now() внутри.
 */

const BANGKOK_TZ = "Asia/Bangkok";
const BANGKOK_OFFSET = "+07:00";

export type FlyerDraft = {
  /// первая содержательная строка — кандидат в заголовок, НЕ истина
  titleCandidate: string | null;
  startDate: Date | null;
  endDate: Date | null;
  /// цена в батах (первая найденная с валютой); в Event поля цены нет —
  /// подставляется в заготовку описания
  priceThb: number | null;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  needsBooking: boolean;
  /// что и как распознано — для честного превью человеку
  notes: string[];
};

const MONTHS: Record<string, number> = {
  // EN полные и сокращения
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
  // RU родительный/именительный и частые сокращения
  января: 1,
  январь: 1,
  янв: 1,
  февраля: 2,
  февраль: 2,
  фев: 2,
  марта: 3,
  март: 3,
  мар: 3,
  апреля: 4,
  апрель: 4,
  апр: 4,
  мая: 5,
  май: 5,
  июня: 6,
  июнь: 6,
  июн: 6,
  июля: 7,
  июль: 7,
  июл: 7,
  августа: 8,
  август: 8,
  авг: 8,
  сентября: 9,
  сентябрь: 9,
  сен: 9,
  сент: 9,
  октября: 10,
  октябрь: 10,
  окт: 10,
  ноября: 11,
  ноябрь: 11,
  ноя: 11,
  декабря: 12,
  декабрь: 12,
  дек: 12,
};

const MONTH_NAMES_PATTERN = Object.keys(MONTHS)
  .sort((a, b) => b.length - a.length)
  .join("|");

type DayMonth = { day: number; month: number; year: number | null };

/// «сегодня» (yyyy-mm-dd) в часовом поясе Паттайи — для подбора года
function bangkokDayKey(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BANGKOK_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * День-месяц (возможно без года) → полная дата: указанный год как есть,
 * иначе ближайшее будущее (сегодня в Паттайе — ещё «будущее»: афиша может
 * анонсировать сегодняшнее событие).
 */
function resolveYear(dm: DayMonth, now: Date): { year: number; note?: string } {
  if (dm.year !== null) {
    return { year: dm.year };
  }
  const today = bangkokDayKey(now);
  const currentYear = Number(today.slice(0, 4));
  const candidate = `${currentYear}-${pad2(dm.month)}-${pad2(dm.day)}`;
  if (candidate >= today) {
    return { year: currentYear };
  }
  return {
    year: currentYear + 1,
    note: `дата «${dm.day}.${pad2(dm.month)}» уже прошла в этом году — взял ${currentYear + 1}; проверьте`,
  };
}

function isValidDayMonth(day: number, month: number): boolean {
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

/**
 * Ищет в тексте дату или диапазон дат. Поддержка:
 * «18 July [2026]», «July 18», «18 июля [2026 [г.]]», «18.07[.2026]»,
 * диапазоны «18–20 July», «18.07–20.07», «с 18 по 20 июля».
 */
export function extractDates(
  text: string,
  now: Date,
): {
  start: DayMonth | null;
  end: DayMonth | null;
  /// точное вхождение даты в тексте — вызывающий код вырезает его перед
  /// поиском времени («18.07» иначе прочиталось бы ещё и как время 18:07)
  matchedText: string | null;
  notes: string[];
} {
  const notes: string[] = [];
  const monthRe = new RegExp(
    // «18[–20] July [2026]» / «с 18 по 20 июля»
    `(?:с\\s+)?(\\d{1,2})(?:\\s*[–—-]\\s*(\\d{1,2})|\\s+по\\s+(\\d{1,2}))?\\s+(${MONTH_NAMES_PATTERN})\\.?\\s*(\\d{4})?(?:\\s*г\\.?)?`,
    "i",
  );
  const monthFirstRe = new RegExp(
    // «July 18[-20][, 2026]»
    `(${MONTH_NAMES_PATTERN})\\.?\\s+(\\d{1,2})(?:\\s*[–—-]\\s*(\\d{1,2}))?(?:,?\\s*(\\d{4}))?`,
    "i",
  );
  // «18.07[.2026]» и диапазон «18.07–20.07»; /-разделитель тоже
  const numericRe =
    /(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?(?:\s*[–—-]\s*(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?)?/;

  const m1 = text.match(monthRe);
  if (m1) {
    const month = MONTHS[m1[4]!.toLowerCase()];
    const year = m1[5] ? Number(m1[5]) : null;
    const day = Number(m1[1]);
    const endDay = m1[2] ? Number(m1[2]) : m1[3] ? Number(m1[3]) : null;
    if (month && isValidDayMonth(day, month)) {
      return {
        start: { day, month, year },
        end:
          endDay && isValidDayMonth(endDay, month) ? { day: endDay, month, year } : null,
        matchedText: m1[0],
        notes,
      };
    }
  }

  const m2 = text.match(monthFirstRe);
  if (m2) {
    const month = MONTHS[m2[1]!.toLowerCase()];
    const day = Number(m2[2]);
    const endDay = m2[3] ? Number(m2[3]) : null;
    const year = m2[4] ? Number(m2[4]) : null;
    if (month && isValidDayMonth(day, month)) {
      return {
        start: { day, month, year },
        end:
          endDay && isValidDayMonth(endDay, month) ? { day: endDay, month, year } : null,
        matchedText: m2[0],
        notes,
      };
    }
  }

  const m3 = text.match(numericRe);
  if (m3) {
    const day = Number(m3[1]);
    const month = Number(m3[2]);
    const year = m3[3] ? Number(m3[3]) : null;
    if (isValidDayMonth(day, month)) {
      let end: DayMonth | null = null;
      if (m3[4] && m3[5]) {
        const endDay = Number(m3[4]);
        const endMonth = Number(m3[5]);
        if (isValidDayMonth(endDay, endMonth)) {
          end = { day: endDay, month: endMonth, year: m3[6] ? Number(m3[6]) : year };
        }
      }
      notes.push(
        `дата «${m3[0]}» прочитана как день.месяц${year ? ".год" : ""} — проверьте`,
      );
      return { start: { day, month, year }, end, matchedText: m3[0], notes };
    }
  }

  return { start: null, end: null, matchedText: null, notes };
}

/**
 * Время или диапазон: «15.00-16.00», «15:00–16:00», «с 15:00 до 16:30»,
 * «3pm», «3:30 pm - 5 pm». Возвращает минуты от полуночи.
 */
export function extractTimes(text: string): { start: number | null; end: number | null } {
  // am/pm-вариант — сперва, чтобы «3:30 pm» не распознался как 3:30 утра;
  // \b после am/pm — иначе «15 amazing…» прочиталось бы как «15 am»
  const ampmRe =
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b(?:\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b)?/i;
  const ampm = text.match(ampmRe);
  if (ampm) {
    const toMinutes = (h: string, m: string | undefined, part: string): number => {
      let hour = Number(h) % 12;
      if (part.toLowerCase() === "pm") hour += 12;
      return hour * 60 + (m ? Number(m) : 0);
    };
    const start = toMinutes(ampm[1]!, ampm[2], ampm[3]!);
    const end = ampm[4] && ampm[6] ? toMinutes(ampm[4], ampm[5], ampm[6]) : null;
    return { start, end };
  }

  // 24-часовой: разделитель «:» или «.», диапазон через -–— или «до»
  const timeRe =
    /(?:с\s+)?([01]?\d|2[0-3])[:.]([0-5]\d)(?:\s*(?:[–—-]|до)\s*([01]?\d|2[0-3])[:.]([0-5]\d))?/;
  const m = text.match(timeRe);
  if (!m) {
    return { start: null, end: null };
  }
  const start = Number(m[1]) * 60 + Number(m[2]);
  const end = m[3] && m[4] ? Number(m[3]) * 60 + Number(m[4]) : null;
  return { start, end };
}

/** Цена в батах: «699 baht», «฿699», «699฿», «699 бат», «THB 699». */
export function extractPriceThb(text: string): number | null {
  const patterns = [
    /฿\s*(\d[\d\s,.]*)/,
    /(\d[\d\s,.]*)\s*฿/,
    /(\d[\d\s,.]*)\s*(?:baht|бат(?:ов)?|thb)/i,
    /(?:thb)\s*(\d[\d\s,.]*)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      // разделители тысяч: пробелы/запятые и точка перед тремя цифрами
      // («1.500 baht» — это 1500, а не полтора бата)
      const value = Number(
        m[1]
          .replace(/[\s,]/g, "")
          .replace(/\.(?=\d{3}\b)/g, "")
          .replace(/\.$/, ""),
      );
      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }
  }
  return null;
}

/**
 * Возраст: «Ages 10-15», «age 3+», «3–8 лет», «от 3 лет», «для детей 4-12»,
 * «from 4 months», «от 6 мес». Годы → месяцы; открытый верх — null.
 */
export function extractAgeMonths(text: string): {
  min: number | null;
  max: number | null;
} {
  // явные месяцы: «from 4 months», «от 6 мес»
  const monthsRe = /(?:от|from)\s+(\d{1,2})\s*(?:months?|мес)/i;
  const mm = text.match(monthsRe);
  if (mm) {
    return { min: Number(mm[1]), max: null };
  }

  // диапазон лет с маркером возраста: «Ages 10-15», «3–8 лет», «для детей 4-12 лет»
  const rangeRe =
    /(?:ages?|возраст|дет(?:ей|ям))\D{0,10}?(\d{1,2})\s*[–—-]\s*(\d{1,2})|(\d{1,2})\s*[–—-]\s*(\d{1,2})\s*(?:лет|года?|y\.?o\.?|years?)/i;
  const r = text.match(rangeRe);
  if (r) {
    const min = Number(r[1] ?? r[3]);
    const max = Number(r[2] ?? r[4]);
    if (min <= max && max < 19) {
      return { min: min * 12, max: max * 12 };
    }
  }

  // открытый низ: «3+», «от 3 лет», «age 5+»
  const plusRe = /(?:от\s+)?(\d{1,2})\s*\+|от\s+(\d{1,2})\s*(?:лет|года?)/i;
  const p = text.match(plusRe);
  if (p) {
    const years = Number(p[1] ?? p[2]);
    if (years > 0 && years < 19) {
      return { min: years * 12, max: null };
    }
  }

  return { min: null, max: null };
}

/** Нужна ли запись: booking/register/DM/запись/регистрация в тексте. */
export function extractNeedsBooking(text: string): boolean {
  return /book(?:ing)?\s|book now|register|reservation|запис(?:ь|аться|ывайтесь)|регистраци|бронь|брониров/i.test(
    text,
  );
}

/// строки, состоящие из даты/времени/цены/служебного — не кандидаты в заголовок
function isNoiseLine(line: string): boolean {
  if (line.length < 4) return true;
  if (/^[\d\s.:–—+฿-]+$/.test(line)) return true;
  if (/^(?:www\.|https?:|@|#)/.test(line)) return true;
  return false;
}

function buildDate(dm: DayMonth, year: number, minutes: number | null): Date {
  const hh = minutes === null ? 0 : Math.floor(minutes / 60);
  const min = minutes === null ? 0 : minutes % 60;
  return new Date(
    `${year}-${pad2(dm.month)}-${pad2(dm.day)}T${pad2(hh)}:${pad2(min)}:00${BANGKOK_OFFSET}`,
  );
}

/**
 * Главная функция: текст афиши → черновик. now обязателен (подбор года
 * и тестируемость). Не найдено → null, а не выдумка.
 */
export function parseEventFlyer(text: string, now: Date): FlyerDraft {
  const notes: string[] = [];
  const normalized = text.replace(/\r/g, "");

  const {
    start: startDm,
    end: endDm,
    matchedText,
    notes: dateNotes,
  } = extractDates(normalized, now);
  notes.push(...dateNotes);
  // дату вырезаем перед поиском времени: «18.07» — дата, а не время 18:07
  const textForTimes = matchedText ? normalized.replace(matchedText, " ") : normalized;
  const times = extractTimes(textForTimes);
  const priceThb = extractPriceThb(normalized);
  const age = extractAgeMonths(normalized);
  const needsBooking = extractNeedsBooking(normalized);

  let startDate: Date | null = null;
  let endDate: Date | null = null;
  if (startDm) {
    const { year, note } = resolveYear(startDm, now);
    if (note) notes.push(note);
    startDate = buildDate(startDm, year, times.start);
    if (endDm) {
      // конец диапазона: тот же подобранный год (диапазон через Новый год —
      // экзотика для афиш; человек увидит в превью)
      const endYear = endDm.year ?? year;
      endDate = buildDate(endDm, endYear, times.end ?? times.start);
    } else if (times.end !== null) {
      endDate = buildDate(startDm, year, times.end);
    }
    if (endDate && endDate < startDate) {
      notes.push("окончание получилось раньше начала — проверьте дату/время");
    }
  } else if (times.start !== null) {
    notes.push("время нашлось, а дата — нет: дату придётся указать руками");
  }

  const titleCandidate =
    normalized
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0 && !isNoiseLine(line)) ?? null;

  if (startDate)
    notes.push(`начало: распознано${times.start === null ? " (время не указано)" : ""}`);
  if (priceThb !== null) notes.push(`цена: ${priceThb} ฿`);
  if (age.min !== null || age.max !== null) notes.push("возраст: распознан");
  if (needsBooking) notes.push("похоже, нужна запись");

  return {
    titleCandidate,
    startDate,
    endDate,
    priceThb,
    minAgeMonths: age.min,
    maxAgeMonths: age.max,
    needsBooking,
    notes,
  };
}
