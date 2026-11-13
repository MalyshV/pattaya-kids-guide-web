import { describe, expect, it } from "vitest";
import {
  isEmptyProgramPlan,
  planProgramFill,
  validateProgramFill,
  type ProgramFill,
  type ProgramFillState,
} from "./program-fill";

const EMPTY: ProgramFillState = {
  description: "[черновик] Заменить описанием. Источники для вычитки:\nКарта: …",
  nameEn: null,
  nameTh: null,
  tipsCount: 0,
  classCount: 0,
  categoryCount: 0,
  photoCount: 0,
  price: null,
  minAgeMonths: null,
  maxAgeMonths: null,
  imageUrl: null,
};

const FULL: ProgramFill = {
  slug: "x-taekwondo",
  nameEn: "Taekwondo at X",
  nameTh: "เทควันโด X",
  description: "Секция тхэквондо для детей от 5 лет. Телефон: 080 000 0000.",
  descriptionEn: "Taekwondo for children from 5. Phone: 080 000 0000.",
  descriptionTh: "เทควันโดสำหรับเด็กอายุ 5 ปีขึ้นไป โทร 080 000 0000",
  tips: [{ text: "Пробное бесплатно.", textEn: "Free trial.", textTh: "ทดลองฟรี" }],
  minAgeMonths: 60,
  maxAgeMonths: 144,
  price: 1500,
  priceUnit: "/ месяц",
  priceUnitEn: "/ month",
  priceUnitTh: "/ เดือน",
  classes: [
    {
      name: "Вт и Чт",
      ageLabel: "5–7 лет",
      minAgeMonths: 60,
      maxAgeMonths: 84,
      parentRequired: null,
      schedule: "17:00–18:00",
    },
  ],
  categorySlugs: ["martial-arts"],
  cover: "/images/activities/x-taekwondo.jpg",
  photos: [{ url: "/images/activities/x-taekwondo-2.jpg", caption: "Зал" }],
  photoRightsNote: "С Facebook-страницы школы, 2026-11",
  photoSource: "PLACE_OWNER",
};

describe("planProgramFill", () => {
  it("у пустого черновика заполняет всё", () => {
    const plan = planProgramFill(EMPTY, FULL);
    expect(plan).toEqual({
      description: true,
      nameEn: true,
      nameTh: true,
      tips: true,
      age: true,
      price: true,
      classes: true,
      categories: true,
      cover: true,
      photos: true,
      skipped: [],
    });
  });

  it("сделанное в админке не трогает и показывает в skipped", () => {
    const plan = planProgramFill(
      {
        description: "Своё описание",
        nameEn: "Own name",
        nameTh: null,
        tipsCount: 2,
        classCount: 1,
        categoryCount: 1,
        photoCount: 3,
        price: 900,
        minAgeMonths: 48,
        maxAgeMonths: null,
        imageUrl: "/images/activities/own.jpg",
      },
      FULL,
    );
    expect(plan.nameTh).toBe(true);
    expect(isEmptyProgramPlan({ ...plan, nameTh: false })).toBe(true);
    expect(plan.skipped).toEqual([
      "описание",
      "название (en)",
      "советы",
      "возраст",
      "цена",
      "группы",
      "категории",
      "обложка",
      "галерея",
    ]);
  });

  it("чего нет в заготовке, того нет и в плане", () => {
    const plan = planProgramFill(EMPTY, {
      slug: "x",
      description: "Описание.",
      descriptionEn: "Description.",
    });
    expect(plan.description).toBe(true);
    expect(isEmptyProgramPlan({ ...plan, description: false })).toBe(true);
    expect(plan.skipped).toEqual([]);
  });

  it("пустое описание тоже можно заменить", () => {
    expect(planProgramFill({ ...EMPTY, description: null }, FULL).description).toBe(true);
  });
});

describe("validateProgramFill", () => {
  it("полная заготовка без ошибок", () => {
    expect(validateProgramFill(FULL)).toEqual([]);
  });

  it("ловит пометку черновика, пустой совет, перевёрнутый возраст и цену без подписи", () => {
    const problems = validateProgramFill({
      ...FULL,
      description: "[черновик] …",
      tips: [{ text: "Совет", textEn: " " }],
      minAgeMonths: 84,
      maxAgeMonths: 60,
      priceUnitEn: undefined,
    });
    expect(problems).toEqual([
      "x-taekwondo: описание содержит пометку [черновик]",
      "x-taekwondo: совет без текста на одном из языков",
      "x-taekwondo: возраст «от» больше, чем «до»",
      "x-taekwondo: цена без подписи («/ месяц») на одном из языков",
    ]);
  });

  it("фото только из /images/activities и с правами", () => {
    const problems = validateProgramFill({
      ...FULL,
      cover: "/images/places/x.jpg",
      photos: [{ url: "/images/activities/a.jpg", caption: "" }],
      photoRightsNote: undefined,
    });
    expect(problems).toEqual([
      "x-taekwondo: обложка: путь не из /images/activities — /images/places/x.jpg",
      "x-taekwondo: фото /images/activities/a.jpg без подписи",
      "x-taekwondo: галерея без строки о правах",
    ]);
  });

  it("ловит неверный возраст группы", () => {
    const [cls] = FULL.classes ?? [];
    const problems = validateProgramFill({
      ...FULL,
      classes: [{ ...cls, minAgeMonths: 90, maxAgeMonths: 60 }],
    });
    expect(problems).toEqual(["x-taekwondo: группа «Вт и Чт»: неверный возраст"]);
  });
});
