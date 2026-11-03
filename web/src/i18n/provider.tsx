"use client";

import { Fragment, type ReactNode, useEffect, useSyncExternalStore } from "react";

import { I18nextProvider } from "react-i18next";

import i18n from "./instance";
import { htmlLang } from "./locales";
import { getLocale, getServerLocale, initClientLocale, subscribe, translate } from "./runtime";

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getLocale, getServerLocale);

  useEffect(() => {
    initClientLocale();
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
    document.title = translate("ARTEX — 自主渗透测试控制台");
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {/* Remount so translated text updates even if the React compiler memoizes children. */}
      <Fragment key={locale}>{children}</Fragment>
    </I18nextProvider>
  );
}
