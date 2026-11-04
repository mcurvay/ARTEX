import tr from "./messages/tr.json" with { type: "json" };
import zh from "./messages/zh.json" with { type: "json" };

export const LOCALES = ["zh", "tr"] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "zh";

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === "zh" || value === "tr";
}

export function intlTag(locale: AppLocale): string {
  return locale === "tr" ? "tr-TR" : "zh-CN";
}

export function htmlLang(locale: AppLocale): string {
  return locale === "tr" ? "tr" : "zh-CN";
}

export function detectLocale(languages: readonly string[]): AppLocale {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if (base === "tr") return "tr";
  }
  return DEFAULT_LOCALE;
}

const catalogs: Record<AppLocale, Record<string, string>> = { zh, tr };

let locale: AppLocale = DEFAULT_LOCALE;

export function getLocale(): AppLocale {
  return locale;
}

export function setLocale(next: AppLocale) {
  if (isAppLocale(next)) locale = next;
}

type TranslateVars = Record<string, string | number | boolean | null | undefined>;

export function translate(key: string | null | undefined, vars?: TranslateVars): string {
  if (key == null || key === "") return "";
  let text = catalogs[locale][key] ?? catalogs.zh[key] ?? key;
  if (!vars) return text;
  text = text.replace(/%\{(\w+)\}/g, (_, name: string) => {
    const value = vars[name];
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (value == null) return "";
    return `%{${name}}`;
  });
  return text;
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  active: AppLocale = getLocale(),
): string {
  return new Intl.NumberFormat(intlTag(active), options).format(value);
}

export function formatDateTime(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  active: AppLocale = getLocale(),
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "";
  const fallback: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat(intlTag(active), options ?? fallback).format(date);
}

export function localeUpper(value: string, active: AppLocale = getLocale()): string {
  return value.toLocaleUpperCase(intlTag(active));
}

export function localeLower(value: string, active: AppLocale = getLocale()): string {
  return value.toLocaleLowerCase(intlTag(active));
}

export function compareText(
  a: string,
  b: string,
  options?: Intl.CollatorOptions,
  active: AppLocale = getLocale(),
): number {
  return a.localeCompare(b, intlTag(active), { numeric: true, sensitivity: "variant", ...options });
}
