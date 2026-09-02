import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import deMessages from "../messages/de.json";

type MessageTree = { [key: string]: string | MessageTree };

// Die Ziel-Locales tr/kk/ru sind fuer den Prototyp bewusst nicht vollstaendig
// uebersetzt (Analyse Kapitel 9: "nicht zwingend jeder Unterpunkt bereits
// vollstaendig uebersetzt"). Fehlende Schluessel fallen auf die deutsche
// Fassung zurueck, damit der Sprachumschalter trotzdem ueberall funktioniert.
function deepMerge(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = result[key];
    if (
      typeof overrideValue === "object" &&
      overrideValue !== null &&
      typeof baseValue === "object" &&
      baseValue !== null
    ) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else if (overrideValue !== undefined && overrideValue !== "") {
      result[key] = overrideValue;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const localeMessages =
    locale === "de"
      ? deMessages
      : (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: deepMerge(
      deMessages as MessageTree,
      localeMessages as MessageTree,
    ),
  };
});
