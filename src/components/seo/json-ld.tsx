import { serializeJsonLd, type JsonLdObject } from "@/lib/seo/json-ld";

/**
 * Скрипт structured data для страницы. dangerouslySetInnerHTML безопасен:
 * serializeJsonLd экранирует «<», закрыть тег данными нельзя.
 */
export function JsonLd({ data }: { data: JsonLdObject }): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
