import { describe, expect, it } from "vitest";
import { decideGuardAction } from "@/components/common/lightbox-history";

describe("decideGuardAction", () => {
  it("фантом: state лайтбокса без открытых лайтбоксов — съесть back-ом", () => {
    expect(decideGuardAction({ lightbox: true }, 0, false)).toBe("swallowPhantom");
  });

  it("лайтбокс открыт — закрытие обрабатывает компонент, страж молчит", () => {
    expect(decideGuardAction({ lightbox: true }, 1, false)).toBe("ignore");
  });

  it("обычная навигация (state без lightbox) — не вмешиваться", () => {
    expect(decideGuardAction(null, 0, false)).toBe("ignore");
    expect(decideGuardAction(undefined, 0, false)).toBe("ignore");
    expect(decideGuardAction({ page: 2 }, 0, false)).toBe("ignore");
    // признак должен быть строго true — «похожие» значения не считаются
    expect(decideGuardAction({ lightbox: "true" }, 0, false)).toBe("ignore");
  });

  it("эхо собственного back(): только сбросить предохранитель, без второго back", () => {
    expect(decideGuardAction(null, 0, true)).toBe("resetSwallowFlag");
    // даже если назначение снова «лайтбоксное» — один шаг за раз, не зацикливаемся
    expect(decideGuardAction({ lightbox: true }, 0, true)).toBe("resetSwallowFlag");
  });
});
