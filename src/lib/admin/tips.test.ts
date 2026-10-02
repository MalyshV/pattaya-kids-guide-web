import { describe, expect, it } from "vitest";
import {
  TIP_LIMITS,
  isTypoFix,
  parseTipLines,
  planTips,
  tipsToFields,
} from "@/lib/admin/tips";

describe("parseTipLines — два поля формы, строка в строку", () => {
  it("перевод — из строки с тем же номером; пустые русские строки пропускаем с парой", () => {
    expect(
      parseTipLines("Нужны носки\n\n  Залог   100 бат ", "Socks required\nлишнее\n"),
    ).toEqual([
      { text: "Нужны носки", textEn: "Socks required" },
      { text: "Залог 100 бат", textEn: null },
    ]);
  });

  it("повторы убираем, без английского поля — перевода нет", () => {
    expect(parseTipLines("Носки\nНоски\r\nПарковка", "")).toEqual([
      { text: "Носки", textEn: null },
      { text: "Парковка", textEn: null },
    ]);
  });

  it("не больше лимита советов и длины", () => {
    const many = Array.from({ length: 30 }, (_, i) => `совет ${i}`).join("\n");
    expect(parseTipLines(many, "")).toHaveLength(TIP_LIMITS.maxCount);
    expect(parseTipLines("я".repeat(2000), "")[0].text).toHaveLength(
      TIP_LIMITS.maxLength,
    );
  });
});

describe("planTips — что создать, поправить и удалить", () => {
  const existing = [
    { id: "a", text: "Нужны носки", textEn: "Socks required", order: 1 },
    { id: "b", text: "Залог 100 бат", textEn: null, order: 2 },
  ];

  it("ничего не меняли — пустой план (перевод и дата проверки целы)", () => {
    expect(
      planTips(existing, parseTipLines("Нужны носки\nЗалог 100 бат", "Socks required")),
    ).toEqual({
      create: [],
      update: [],
      deleteIds: [],
    });
  });

  it("новая строка создаётся, пропавшая удаляется, порядок обновляется", () => {
    expect(
      planTips(
        existing,
        parseTipLines("В будни дешевле\nНужны носки", "\nSocks required"),
      ),
    ).toEqual({
      create: [{ text: "В будни дешевле", textEn: null, order: 1 }],
      update: [{ id: "a", textEn: "Socks required", order: 2 }],
      deleteIds: ["b"],
    });
  });

  it("переписали русский текст — это новый совет, старый уходит", () => {
    const plan = planTips(
      existing,
      parseTipLines("Нужны носки\nЗалог 200 бат", "Socks required"),
    );
    expect(plan.create).toEqual([{ text: "Залог 200 бат", textEn: null, order: 2 }]);
    expect(plan.deleteIds).toEqual(["b"]);
  });

  it("поменяли только перевод — обновление, не пересоздание", () => {
    expect(
      planTips(
        existing,
        parseTipLines("Нужны носки\nЗалог 100 бат", "Socks required\nDeposit 100 THB"),
      ).update,
    ).toEqual([{ id: "b", textEn: "Deposit 100 THB", order: 2 }]);
  });

  it("очистили поле — удаляются все", () => {
    expect(planTips(existing, parseTipLines("", "")).deleteIds).toEqual(["a", "b"]);
  });
});

describe("isTypoFix — опечатка или новый смысл", () => {
  it("пара букв при тех же цифрах — опечатка", () => {
    expect(isTypoFix("Нужны носки для дитей", "Нужны носки для детей")).toBe(true);
    expect(isTypoFix("Залог 100 бат возвращают", "Залог 100 бат возвращают.")).toBe(true);
    expect(
      isTypoFix("Вход с 3 лет, носки обязательны", "Вход с 3 лет — носки обязательны"),
    ).toBe(true);
  });

  it("поменялись цифры — это уже другой факт, даже если буква одна", () => {
    expect(isTypoFix("Носки 50 бат", "Носки 60 бат")).toBe(false);
    expect(isTypoFix("Касса до 17:00", "Касса до 18:00")).toBe(false);
    expect(isTypoFix("Вход с 3 лет", "Вход с трёх лет")).toBe(false);
  });

  it("переписали по смыслу или тот же текст — нет", () => {
    expect(isTypoFix("Нужны носки", "Носки не нужны")).toBe(false);
    expect(isTypoFix("Нужны носки", "В будни дешевле")).toBe(false);
    expect(isTypoFix("Нужны носки", "Нужны носки")).toBe(false);
    expect(isTypoFix("Да", "Нет")).toBe(false);
  });
});

describe("planTips — исправленная опечатка остаётся тем же советом", () => {
  const existing = [
    { id: "a", text: "Нужны носки для дитей", textEn: "Socks required", order: 1 },
    { id: "b", text: "Залог 100 бат", textEn: null, order: 2 },
  ];

  it("опечатку поправили — совет обновляется, не пересоздаётся", () => {
    expect(
      planTips(
        existing,
        parseTipLines("Нужны носки для детей\nЗалог 100 бат", "Socks required"),
      ),
    ).toEqual({
      create: [],
      update: [
        { id: "a", text: "Нужны носки для детей", textEn: "Socks required", order: 1 },
      ],
      deleteIds: [],
    });
  });

  it("поменяли цифру — новый совет, старый уходит", () => {
    const plan = planTips(
      existing,
      parseTipLines("Нужны носки для дитей\nЗалог 200 бат", "Socks required"),
    );
    expect(plan.create).toEqual([{ text: "Залог 200 бат", textEn: null, order: 2 }]);
    expect(plan.update).toEqual([]);
    expect(plan.deleteIds).toEqual(["b"]);
  });

  it("точное совпадение важнее похожего: совет не уводится у своей строки", () => {
    const close = [
      { id: "a", text: "Нужны носки детям", textEn: null, order: 1 },
      { id: "b", text: "Нужны носки детям.", textEn: null, order: 2 },
    ];
    expect(
      planTips(close, parseTipLines("Нужны носки детям.\nНужны носки детям", "")),
    ).toEqual({
      create: [],
      update: [
        { id: "b", textEn: null, order: 1 },
        { id: "a", textEn: null, order: 2 },
      ],
      deleteIds: [],
    });
  });
});

describe("tipsToFields — из базы обратно в форму", () => {
  it("строка в строку; без переводов английское поле пустое", () => {
    expect(
      tipsToFields([
        { text: "Нужны носки", textEn: null },
        { text: "Залог", textEn: "Deposit" },
      ]),
    ).toEqual({ ru: "Нужны носки\nЗалог", en: "\nDeposit" });
    expect(tipsToFields([{ text: "Носки", textEn: null }])).toEqual({
      ru: "Носки",
      en: "",
    });
  });

  it("туда и обратно — план пустой", () => {
    const existing = [
      { id: "a", text: "Нужны носки", textEn: null, order: 1 },
      { id: "b", text: "Залог", textEn: "Deposit", order: 2 },
    ];
    const fields = tipsToFields(existing);
    expect(planTips(existing, parseTipLines(fields.ru, fields.en))).toEqual({
      create: [],
      update: [],
      deleteIds: [],
    });
  });
});
