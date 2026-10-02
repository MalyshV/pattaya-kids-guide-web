import { describe, expect, it } from "vitest";
import {
  CLASS_LIMITS,
  classFieldName,
  classRowError,
  classRowMessage,
  parseClassRows,
  planClasses,
  type ClassField,
} from "@/lib/admin/class-rows";

type RowInput = Partial<Record<ClassField, string>>;
const reader =
  (rows: RowInput[]) =>
  (index: number, field: ClassField): string | undefined =>
    rows[index]?.[field];

const BUGS: RowInput = {
  id: "c1",
  name: "Bugs",
  minAgeMonths: "4",
  maxAgeMonths: "10",
  ageLabel: "4–10 мес",
  ageLabelEn: "4–10 mo",
  parentRequired: "true",
  schedule: "Ср 10:00 · Вс 09:15",
  scheduleEn: "Wed 10:00 · Sun 09:15",
};

describe("parseClassRows — строки таблицы классов", () => {
  it("заполненная строка разбирается; строка без названия пропускается", () => {
    const result = parseClassRows(reader([BUGS, { schedule: "забытый хвост" }, {}]), 3);
    expect(result).toEqual({
      ok: true,
      rows: [
        {
          id: "c1",
          name: "Bugs",
          minAgeMonths: 4,
          maxAgeMonths: 10,
          ageLabel: "4–10 мес",
          ageLabelEn: "4–10 mo",
          parentRequired: true,
          schedule: "Ср 10:00 · Вс 09:15",
          scheduleEn: "Wed 10:00 · Sun 09:15",
        },
      ],
    });
  });

  it("подпись возраста не написали — собирается из месяцев на обоих языках", () => {
    const result = parseClassRows(
      reader([
        { name: "Birds", minAgeMonths: "10", maxAgeMonths: "19", schedule: "Вт 10:00" },
      ]),
      1,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rows[0].id).toBeNull();
      expect(result.rows[0].ageLabel).toContain("10");
      expect(result.rows[0].ageLabel).toContain("мес");
      expect(result.rows[0].ageLabelEn).toContain("mo");
      expect(result.rows[0].scheduleEn).toBeNull();
      expect(result.rows[0].parentRequired).toBeNull();
    }
  });

  it("неразрывный пробел в расписании сохраняется, обычные схлопываются", () => {
    const nbsp = String.fromCharCode(0xa0);
    const schedule = `8:20–14:00 ·   6${nbsp}500 ฿`;
    const result = parseClassRows(reader([{ ...BUGS, schedule }]), 1);
    expect(result.ok && result.rows[0].schedule).toBe(`8:20–14:00 · 6${nbsp}500 ฿`);
  });

  it("«с родителем»: да / нет / уточняется", () => {
    const rows = ["true", "false", ""].map((parentRequired) => ({
      ...BUGS,
      parentRequired,
    }));
    const result = parseClassRows(reader(rows), 3);
    expect(result.ok && result.rows.map((row) => row.parentRequired)).toEqual([
      true,
      false,
      null,
    ]);
  });

  it("плохой возраст — ошибка с номером строки, как его видит человек", () => {
    const bad = (patch: RowInput) =>
      parseClassRows(reader([BUGS, { ...BUGS, ...patch }]), 2);
    expect(bad({ minAgeMonths: "" })).toEqual({ ok: false, row: 2, problem: "age" });
    expect(bad({ minAgeMonths: "12", maxAgeMonths: "6" })).toEqual({
      ok: false,
      row: 2,
      problem: "age",
    });
    expect(bad({ maxAgeMonths: "1,5" })).toEqual({ ok: false, row: 2, problem: "age" });
    expect(bad({ maxAgeMonths: String(CLASS_LIMITS.maxAgeMonths + 1) })).toEqual({
      ok: false,
      row: 2,
      problem: "age",
    });
  });

  it("нет расписания, слишком длинно, слишком много классов", () => {
    expect(parseClassRows(reader([{ ...BUGS, schedule: " " }]), 1)).toEqual({
      ok: false,
      row: 1,
      problem: "schedule",
    });
    expect(parseClassRows(reader([{ ...BUGS, name: "я".repeat(101) }]), 1)).toEqual({
      ok: false,
      row: 1,
      problem: "tooLong",
    });
    const many = Array.from({ length: CLASS_LIMITS.maxCount + 1 }, () => BUGS);
    expect(parseClassRows(reader(many), many.length)).toEqual({
      ok: false,
      row: CLASS_LIMITS.maxCount + 1,
      problem: "tooMany",
    });
  });
});

describe("planClasses — что создать, обновить и удалить", () => {
  const existing = [
    {
      id: "c1",
      ageLabel: "4–10 мес",
      ageLabelTh: "4–10 เดือน",
      minAgeMonths: 4,
      maxAgeMonths: 10,
      schedule: "Ср 10:00 · Вс 09:15",
      scheduleTh: "พ. 10:00 · อา. 09:15",
    },
    {
      id: "c2",
      ageLabel: "10–19 мес",
      ageLabelTh: null,
      minAgeMonths: 10,
      maxAgeMonths: 19,
      schedule: "Вт 10:00",
      scheduleTh: "อ. 10:00",
    },
  ];
  const row = (patch: RowInput) => {
    const result = parseClassRows(reader([{ ...BUGS, ...patch }]), 1);
    if (!result.ok) {
      throw new Error("строка должна разобраться");
    }
    return result.rows[0];
  };

  it("ничего не меняли — тайские подписи целы, второй класс удаляется, раз его нет в форме", () => {
    const plan = planClasses(existing, [row({})]);
    expect(plan.create).toEqual([]);
    expect(plan.deleteIds).toEqual(["c2"]);
    expect(plan.update[0].id).toBe("c1");
    expect(plan.update[0].data.ageLabelTh).toBe("4–10 เดือน");
    expect(plan.update[0].data.scheduleTh).toBe("พ. 10:00 · อา. 09:15");
    expect(plan.update[0].data.order).toBe(1);
  });

  it("поменяли время — тайское расписание сбрасывается, возраст остаётся", () => {
    const plan = planClasses(existing, [row({ schedule: "Ср 11:00 · Вс 09:15" })]);
    expect(plan.update[0].data.scheduleTh).toBeNull();
    expect(plan.update[0].data.ageLabelTh).toBe("4–10 เดือน");
  });

  it("опечатка в расписании при тех же цифрах — перевод остаётся", () => {
    const plan = planClasses(existing, [row({ schedule: "Ср 10:00 · Вск 09:15" })]);
    expect(plan.update[0].data.scheduleTh).toBe("พ. 10:00 · อา. 09:15");
  });

  it("поменяли возраст — тайская подпись пересобирается из месяцев", () => {
    const plan = planClasses(existing, [
      row({ maxAgeMonths: "12", ageLabel: "4–12 мес" }),
    ]);
    expect(plan.update[0].data.ageLabelTh).not.toBe("4–10 เดือน");
    // 12 месяцев по-тайски — «1 ขวบ»
    expect(plan.update[0].data.ageLabelTh).toBe("4 เดือน – 1 ขวบ");
  });

  it("строка без id или с чужим id — новый класс; порядок — по строкам формы", () => {
    const plan = planClasses(existing, [
      row({ id: "", name: "Новый" }),
      row({ id: "чужой", name: "Ещё" }),
      row({ id: "c2", name: "Birds" }),
    ]);
    expect(plan.create.map((item) => [item.name, item.order])).toEqual([
      ["Новый", 1],
      ["Ещё", 2],
    ]);
    expect(plan.update.map((item) => [item.id, item.data.order])).toEqual([["c2", 3]]);
    expect(plan.deleteIds).toEqual(["c1"]);
  });

  it("один id в двух строках — второй считается новым, а не затирает первый", () => {
    const plan = planClasses(existing, [row({}), row({ name: "Копия" })]);
    expect(plan.update).toHaveLength(1);
    expect(plan.create.map((item) => item.name)).toEqual(["Копия"]);
  });

  it("пустая форма — удаляются все классы", () => {
    expect(planClasses(existing, []).deleteIds).toEqual(["c1", "c2"]);
  });
});

describe("имена полей и сообщения", () => {
  it("имя поля формы и код ошибки", () => {
    expect(classFieldName(2, "schedule")).toBe("class_2_schedule");
    expect(classRowError(3, "age")).toBe("class-3-age");
  });

  it("сообщение называет строку; чужие коды — null", () => {
    expect(classRowMessage("class-3-age")).toContain("строка 3");
    expect(classRowMessage("class-3-constructor")).toBeNull();
    expect(classRowMessage("long-name")).toBeNull();
    expect(classRowMessage(undefined)).toBeNull();
  });
});
