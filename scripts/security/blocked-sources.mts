/**
 * Хук Claude Code: не пускает на сайты из docs/BLOCKED_SOURCES.md (там нашли
 * спрятанные инструкции для ИИ). Срабатывает перед вызовом инструмента
 * (PreToolUse): получает его вход на stdin и, если адрес ведёт на
 * запрещённый домен или его поддомен, останавливает вызов (код выхода 2,
 * причина — в stderr, её видит модель).
 *
 * Подключение — в локальном .claude/settings.json (папка не в git):
 *
 *   "hooks": { "PreToolUse": [{
 *     "matcher": "WebFetch|Bash|mcp__Claude_Browser__.*|mcp__claude-in-chrome__.*",
 *     "hooks": [{ "type": "command",
 *       "command": "node \"$CLAUDE_PROJECT_DIR/scripts/security/blocked-sources.mts\"" }]
 *   }] }
 *
 * Node 22.18+ запускает TypeScript сам (типы просто отбрасываются), без
 * сборки и tsx; расширение .mts — чтобы файл сразу читался как ES-модуль.
 * Поэтому в нём нет локальных импортов. Список доменов — первая колонка таблицы в
 * docs/BLOCKED_SOURCES.md (домен в обратных кавычках).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Домены из строк таблицы вида «| `example.com` | … |». */
export function parseBlockedDomains(markdown: string): string[] {
  const domains = new Set<string>();
  for (const line of markdown.split("\n")) {
    const match = /^\|\s*`([^`]+)`\s*\|/.exec(line.trim());
    if (!match) continue;
    const domain = match[1]
      .trim()
      .toLowerCase()
      .replace(/^www\./, "");
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) domains.add(domain);
  }
  return [...domains];
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Где в тексте домен стоит как адрес: «https://…», «www.…», «sub.домен/…». */
function mentionsHost(text: string, domain: string): boolean {
  const host = `(?<![a-z0-9.-])([a-z0-9-]+\\.)*${escapeRegExp(domain)}(?![a-z0-9-])(?!\\.[a-z0-9])`;
  return new RegExp(host, "i").test(text);
}

const NETWORK_COMMAND =
  /(^|[\s;&|(`$])(curl|wget|http|https|lynx|links|w3m|open|aria2c|httpie|xh)(\s|$)|https?:\/\/|\bfetch\(|urllib|requests\.|playwright|puppeteer/i;

/**
 * Запрещённый домен, на который ведёт вызов инструмента, или null.
 * Для Bash — только если команда сетевая (curl, wget, открытие URL…):
 * упоминание домена в grep или в тексте коммита не блокируем.
 */
export function findBlockedDomain(
  toolName: string,
  toolInput: unknown,
  domains: readonly string[],
): string | null {
  if (domains.length === 0) return null;
  if (toolName === "Bash") {
    const command =
      typeof toolInput === "object" && toolInput !== null && "command" in toolInput
        ? String((toolInput as { command: unknown }).command)
        : "";
    if (!NETWORK_COMMAND.test(command)) return null;
    return domains.find((domain) => mentionsHost(command, domain)) ?? null;
  }
  const text = JSON.stringify(toolInput ?? "");
  return domains.find((domain) => mentionsHost(text, domain)) ?? null;
}

function main(): void {
  let event: { tool_name?: string; tool_input?: unknown; cwd?: string };
  try {
    event = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return;
  }
  const root =
    process.env.CLAUDE_PROJECT_DIR ??
    path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
  let markdown: string;
  try {
    markdown = readFileSync(path.join(root, "docs/BLOCKED_SOURCES.md"), "utf8");
  } catch {
    return;
  }
  const blocked = findBlockedDomain(
    event.tool_name ?? "",
    event.tool_input,
    parseBlockedDomains(markdown),
  );
  if (!blocked) return;
  process.stderr.write(
    `Сайт ${blocked} в списке запрещённых источников (docs/BLOCKED_SOURCES.md): ` +
      "на нём нашли спрятанные инструкции для ИИ. Не открывать и не цитировать — " +
      "возьмите другой источник.\n",
  );
  process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
