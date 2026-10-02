import { describe, expect, it } from "vitest";
import { isSiteImagePath, rotatedFileName } from "@/lib/admin/photo-path";

describe("isSiteImagePath — фото из папки сайта, которое можно прочитать", () => {
  it("картинки из /images/ — да", () => {
    expect(isSiteImagePath("/images/places/laridea-1.jpg")).toBe(true);
    expect(isSiteImagePath("/images/uploads/places/abc-1600x1067.jpg")).toBe(true);
    expect(isSiteImagePath("/images/events/poster.PNG".toLowerCase())).toBe(true);
  });

  it("выход наверх, чужой хост, не картинка, другой корень — нет", () => {
    expect(isSiteImagePath("/images/../.env")).toBe(false);
    expect(isSiteImagePath("/images/../../etc/passwd.jpg")).toBe(false);
    expect(isSiteImagePath("//evil.example/images/a.jpg")).toBe(false);
    expect(isSiteImagePath("https://evil.example/images/a.jpg")).toBe(false);
    expect(isSiteImagePath("/images//a.jpg")).toBe(false);
    expect(isSiteImagePath("/images/a.svg")).toBe(false);
    expect(isSiteImagePath("/api/images/a.jpg")).toBe(false);
    expect(isSiteImagePath("/images/a.jpg?x=1")).toBe(false);
  });
});

describe("rotatedFileName", () => {
  it("размеры — в имени, как у обычных загрузок", () => {
    expect(rotatedFileName("ab12", 1067, 1600)).toBe("ab12-1067x1600.jpg");
  });
});
