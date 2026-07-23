import { cache } from "react";
import { mapSearchIndex } from "@/mappers/search.mapper";

/**
 * Сборка поискового индекса с дедупликацией в рамках запроса: layout города
 * (лупа в шапке) и каталог /places (встроенная строка) собирают индекс из
 * одних и тех же кэшированных строк — React cache отдаёт один массив, и
 * Flight сериализует его в payload один раз (back-reference вместо копии).
 * Аргументы сравниваются по ссылке: строки приходят из React-cached
 * getSearchRows, поэтому в пределах запроса они идентичны.
 */
export const getSearchIndex = cache(mapSearchIndex);
