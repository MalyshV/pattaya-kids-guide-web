import { beforeAll, describe, expect, it } from "vitest";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import {
  buildActivityPost,
  buildEventPost,
  buildListReply,
  buildPlacePost,
  escapeHtml,
  formatEventDates,
  truncateAtWord,
} from "./format";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
});

function eventDto(overrides: Partial<EventListItemDto> = {}): EventListItemDto {
  return {
    id: "evt-1",
    title: "Детская ярмарка",
    slug: "kids-fair",
    imageUrl: null,
    description: null,
    startDate: "2026-07-12T03:00:00.000Z", // 10:00 по Паттайе
    endDate: null,
    minAgeMonths: null,
    maxAgeMonths: null,
    locationName: null,
    address: null,
    place: null,
    ...overrides,
  };
}

describe("escapeHtml", () => {
  it("экранирует амперсанд и угловые скобки", () => {
    expect(escapeHtml("Kids <Fun> & Co")).toBe("Kids &lt;Fun&gt; &amp; Co");
  });
});

describe("truncateAtWord", () => {
  it("короткий текст возвращает как есть", () => {
    expect(truncateAtWord("короткий текст", 100)).toBe("короткий текст");
  });

  it("режет по границе слова и ставит многоточие", () => {
    expect(truncateAtWord("раз два три четыре", 12)).toBe("раз два три…");
  });
});

describe("formatEventDates", () => {
  it("один день со временем", () => {
    expect(formatEventDates("2026-07-12T03:00:00.000Z", null)).toBe("12 июля, 10:00");
  });

  it("полночь по Паттайе — время не показываем", () => {
    // 17:00 UTC 11 июля = 00:00 12 июля в Паттайе
    expect(formatEventDates("2026-07-11T17:00:00.000Z", null)).toBe("12 июля");
  });

  it("начало и конец в один бангкокский день — как один день", () => {
    expect(formatEventDates("2026-07-12T03:00:00.000Z", "2026-07-12T10:00:00.000Z")).toBe(
      "12 июля, 10:00",
    );
  });

  it("многодневное — диапазон", () => {
    expect(formatEventDates("2026-07-12T03:00:00.000Z", "2026-07-15T10:00:00.000Z")).toBe(
      "12 июля – 15 июля",
    );
  });

  it("одинаковые день+месяц разных лет — диапазон, а не один день", () => {
    expect(formatEventDates("2026-07-12T03:00:00.000Z", "2027-07-12T03:00:00.000Z")).toBe(
      "12 июля – 12 июля",
    );
  });
});

describe("buildEventPost", () => {
  it("экранирует заголовок и собирает ссылку на страницу события", () => {
    const post = buildEventPost(eventDto({ title: "Праздник <детям> & родителям" }));

    expect(post.text).toContain("<b>Праздник &lt;детям&gt; &amp; родителям</b>");
    expect(post.text).toContain("#афиша");
    expect(post.linkUrl).toBe("https://example.test/ru/pattaya/events/kids-fair");
  });

  it("картинка из public превращается в абсолютный URL", () => {
    const post = buildEventPost(eventDto({ imageUrl: "/images/events/fair.jpg" }));
    expect(post.photoUrl).toBe("https://example.test/images/events/fair.jpg");
  });

  it("возраст события попадает в пост; без возраста строки 👶 нет", () => {
    const withAge = buildEventPost(eventDto({ minAgeMonths: 120, maxAgeMonths: 180 }));
    // формат — как на карточках занятий (общий formatAgeRange)
    expect(withAge.text).toContain("👶 10 лет – 15 лет");
    expect(buildEventPost(eventDto()).text).not.toContain("👶");
  });

  it("локация: имя площадки из place важнее locationName", () => {
    const post = buildEventPost(
      eventDto({
        locationName: "Где-то ещё",
        place: { id: "p1", name: "Play Barn", slug: "play-barn" },
      }),
    );
    expect(post.text).toContain("📍 Play Barn");
  });

  it("аномально длинный заголовок не ломает HTML поста", () => {
    // заголовок длиннее лимита + описание, добивающее пост до обрезки
    const post = buildEventPost(
      eventDto({
        title: "Очень длинное название события ".repeat(10),
        description: "Подробное описание праздника для всей семьи. ".repeat(20),
      }),
    );

    // жирный тег закрыт (иначе Telegram отклонит пост с ошибкой 400)
    expect(post.text).toContain("</b>");
    // укладываемся в лимит подписи к фото с запасом
    expect(post.text.length).toBeLessThanOrEqual(1024);
  });

  it("обрезка не оставляет обрубок HTML-сущности в конце", () => {
    // описание из амперсандов: после экранирования каждый — 5 символов
    const post = buildEventPost(eventDto({ description: "&".repeat(350) }));

    expect(post.text.length).toBeLessThanOrEqual(1024);
    // в конце нет недорезанного «&am…» и весь текст без голых & < >
    expect(post.text).not.toMatch(/&[#a-zA-Z0-9]{0,7}…/);
  });
});

describe("buildPlacePost", () => {
  it("собирает пост места с адресом, хештегом и ссылкой", () => {
    const post = buildPlacePost({
      name: "Play Barn",
      slug: "play-barn",
      description: "Крытый игровой центр",
      imageUrl: null,
      address: "Pattaya Klang, Soi 12",
    });

    expect(post.text).toContain("<b>Play Barn</b>");
    expect(post.text).toContain("📍 Pattaya Klang, Soi 12");
    expect(post.text).toContain("#место");
    expect(post.linkUrl).toBe("https://example.test/ru/pattaya/places/play-barn");
  });
});

describe("buildListReply", () => {
  it("заголовок жирный, пункты — ссылки с подписью", () => {
    const reply = buildListReply("События сегодня", [
      {
        title: "Ярмарка <детям>",
        url: "https://example.test/ru/pattaya/events/kids-fair",
        note: "12 июля · Play Barn",
      },
    ]);

    expect(reply).toContain("<b>События сегодня</b>");
    expect(reply).toContain(
      '<a href="https://example.test/ru/pattaya/events/kids-fair">Ярмарка &lt;детям&gt;</a>',
    );
    expect(reply).toContain("12 июля · Play Barn");
  });
});

describe("buildActivityPost", () => {
  const base = {
    name: "Плавание для малышей",
    slug: "baby-swim",
    type: "COURSE" as const,
    description: "Занятия в тёплом бассейне с инструктором.",
    imageUrl: "/images/activities/swim.jpg",
    price: 1500,
    currency: "THB",
    priceUnit: "/ месяц",
    minAgeMonths: 6,
    maxAgeMonths: 36,
    startDate: null,
    endDate: null,
    locationName: "The Play Barn",
  };

  it("регулярное занятие: возраст, место, цена, хештег и ссылка", () => {
    const post = buildActivityPost(base);
    expect(post.text).toContain("Новое занятие в гиде");
    expect(post.text).toContain("<b>Плавание для малышей</b>");
    expect(post.text).toContain("👶 ");
    expect(post.text).toContain("📍 The Play Barn");
    expect(post.text).toContain("💰 1");
    expect(post.text).toContain("฿ / месяц");
    expect(post.text).toContain("#занятия");
    expect(post.text).not.toContain("📅");
    expect(post.linkUrl).toBe("https://example.test/ru/pattaya/activities/baby-swim");
    expect(post.photoUrl).toBe("https://example.test/images/activities/swim.jpg");
  });

  it("лагерь: свой заголовок, даты и хештег", () => {
    const post = buildActivityPost({
      ...base,
      type: "CAMP",
      startDate: "2026-10-12T02:00:00.000Z",
      endDate: "2026-10-16T09:00:00.000Z",
    });
    expect(post.text).toContain("Лагерь в гиде");
    expect(post.text).toContain("📅 12 октября – 16 октября");
    expect(post.text).toContain("#лагерь");
  });

  it("без цены, возраста, места и фото — этих строк просто нет", () => {
    const post = buildActivityPost({
      ...base,
      price: null,
      minAgeMonths: null,
      maxAgeMonths: null,
      locationName: null,
      imageUrl: null,
    });
    expect(post.text).not.toContain("💰");
    expect(post.text).not.toContain("👶");
    expect(post.text).not.toContain("📍");
    expect(post.photoUrl).toBeNull();
  });

  it("экранирует название и подпись цены", () => {
    const post = buildActivityPost({ ...base, name: "Art & <Craft>", priceUnit: "<b>" });
    expect(post.text).toContain("<b>Art &amp; &lt;Craft&gt;</b>");
    expect(post.text).toContain("&lt;b&gt;");
  });
});
