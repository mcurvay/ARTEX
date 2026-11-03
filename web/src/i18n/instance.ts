import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tr from "./messages/tr.json" with { type: "json" };
import zh from "./messages/zh.json" with { type: "json" };

void i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    tr: { translation: tr },
  },
  lng: "zh",
  fallbackLng: "zh",
  supportedLngs: ["zh", "tr"],
  // Source strings are the keys, so "." / ":" must not split them.
  keySeparator: false,
  nsSeparator: false,
  pluralSeparator: "||||",
  interpolation: {
    escapeValue: false,
    // Go templates in a few help strings use "{{". Keep those literal.
    prefix: "%{",
    suffix: "}",
  },
  returnNull: false,
  returnEmptyString: false,
  initAsync: false,
  react: {
    useSuspense: false,
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: [
      "br",
      "strong",
      "b",
      "i",
      "em",
      "p",
      "code",
      "span",
      "kbd",
      "u",
      "s",
      "small",
      "sub",
      "sup",
      "mark",
    ],
  },
});

export default i18n;
