import { describe, expect, it } from "vitest";
import { resolveShortMapsLink } from "@/lib/geo/resolve-maps-link";

const FULL =
  "https://www.google.com/maps/place/Play+Barn/@12.9,100.9,15z/data=!3d12.91!4d100.92";

function redirects(map: Record<string, string>): (url: string) => Promise<Response> {
  return async (url: string) => {
    const location = map[url];
    return new Response(
      null,
      location ? { status: 302, headers: { location } } : { status: 200 },
    );
  };
}

describe("resolveShortMapsLink — только Google, только https", () => {
  it("maps.app.goo.gl → полная ссылка Карт", async () => {
    const fetchImpl = redirects({ "https://maps.app.goo.gl/abc": FULL });
    expect(await resolveShortMapsLink("https://maps.app.goo.gl/abc", fetchImpl)).toBe(
      new URL(FULL).toString(),
    );
  });

  it("через страницу согласия — берём continue, туда не ходим", async () => {
    const consent = `https://consent.google.com/ml?continue=${encodeURIComponent(FULL)}`;
    const fetchImpl = redirects({ "https://maps.app.goo.gl/abc": consent });
    expect(await resolveShortMapsLink("maps.app.goo.gl/abc", fetchImpl)).toBe(
      new URL(FULL).toString(),
    );
  });

  it("редирект на чужой хост или http — null (SSRF)", async () => {
    expect(
      await resolveShortMapsLink(
        "https://maps.app.goo.gl/abc",
        redirects({ "https://maps.app.goo.gl/abc": "http://169.254.169.254/latest" }),
      ),
    ).toBeNull();
    expect(
      await resolveShortMapsLink(
        "https://maps.app.goo.gl/abc",
        redirects({ "https://maps.app.goo.gl/abc": "https://evil.example/maps" }),
      ),
    ).toBeNull();
  });

  it("не короткая ссылка / сеть упала / без редиректа — null", async () => {
    let called = false;
    const spy = async (): Promise<Response> => {
      called = true;
      return new Response(null, { status: 200 });
    };
    expect(await resolveShortMapsLink("https://evil.example/x", spy)).toBeNull();
    expect(called).toBe(false);
    expect(
      await resolveShortMapsLink("https://maps.app.goo.gl/abc", async () => {
        throw new Error("network");
      }),
    ).toBeNull();
    expect(await resolveShortMapsLink("https://maps.app.goo.gl/abc", spy)).toBeNull();
  });

  it("зацикливание — не больше 4 переходов", async () => {
    let hops = 0;
    const loop = async (): Promise<Response> => {
      hops += 1;
      return new Response(null, {
        status: 302,
        headers: { location: "https://maps.app.goo.gl/abc" },
      });
    };
    expect(await resolveShortMapsLink("https://maps.app.goo.gl/abc", loop)).toBeNull();
    expect(hops).toBe(4);
  });
});
