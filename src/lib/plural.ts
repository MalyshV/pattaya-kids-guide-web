/**
 * Возвращает правильную форму русского слова в зависимости от числа.
 *
 * forms = [для 1, для 2-4, для 5-0] — например ["место", "места", "мест"].
 * plural(1, ...) -> "место", plural(3, ...) -> "места", plural(5, ...) -> "мест".
 */
export function plural(count: number, forms: [string, string, string]): string {
  const tens = Math.abs(count) % 100;
  const ones = tens % 10;

  if (tens > 10 && tens < 20) {
    return forms[2];
  }

  if (ones > 1 && ones < 5) {
    return forms[1];
  }

  if (ones === 1) {
    return forms[0];
  }

  return forms[2];
}
