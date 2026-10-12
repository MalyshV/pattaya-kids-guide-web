import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionBanner } from "@/components/common/action-banner";

describe("ActionBanner", () => {
  it("на сервере не падает без document и ничего не рисует (портал — только в браузере)", () => {
    expect(typeof document).toBe("undefined");

    const html = renderToStaticMarkup(
      <ActionBanner
        variant="success"
        title="Изменения сохранены"
        closeLabel="Закрыть"
        onClose={() => {}}
      />,
    );

    expect(html).toBe("");
  });
});
