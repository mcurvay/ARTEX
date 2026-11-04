import i18n from "./instance";
import { type AppLocale, DEFAULT_LOCALE, detectLocale, isAppLocale, LOCALE_STORAGE_KEY } from "./locales";
import { getLocale as readLocale, translate, setLocale as writeLocale } from "./pure";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getLocale(): AppLocale {
  return readLocale();
}

export function getServerLocale(): AppLocale {
  return DEFAULT_LOCALE;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: AppLocale) {
  if (!isAppLocale(next)) return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    // Private mode and disabled storage still switch the current view.
  }
  const changed = next !== readLocale();
  writeLocale(next);
  void i18n.changeLanguage(next);
  if (typeof document !== "undefined") document.documentElement.lang = next === "tr" ? "tr" : "zh-CN";
  if (changed) emit();
}

export { translate };

export function readStoredLocale(): AppLocale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isAppLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Apply the saved choice, or the browser language, after hydration. */
export function initClientLocale() {
  const stored = readStoredLocale();
  const languages = typeof navigator !== "undefined" ? navigator.languages : [];
  const next = stored ?? detectLocale(languages?.length ? languages : [navigator.language]);
  if (next !== readLocale()) setLocale(next);
  else if (typeof document !== "undefined") document.documentElement.lang = next === "tr" ? "tr" : "zh-CN";
}
