import tr from "./messages/tr.json" with { type: "json" };
import { detectLocale, formatDateTime, formatNumber, localeLower, localeUpper, setLocale, translate } from "./pure.ts";
import assert from "node:assert/strict";
import test from "node:test";

const tokens = (value) =>
  value.match(/%\{[A-Za-z0-9_]+\}|\{\{[^}]+\}\}|<\/?c\d+>|<\/?b>|<\/?br\s*\/>|<\/?span>|<\/?code>/g) ?? [];

test("every Turkish string keeps the source placeholders and tags", () => {
  for (const [key, value] of Object.entries(tr)) {
    assert.equal(tokens(value).sort().join("|"), tokens(key).sort().join("|"), key.slice(0, 80));
    assert.ok(value.trim().length > 0);
  }
});

test("browser languages fall back to the existing Chinese UI", () => {
  assert.equal(detectLocale(["en-US", "de"]), "zh");
  assert.equal(detectLocale(["zh-CN"]), "zh");
  assert.equal(detectLocale([]), "zh");
});

test("a Turkish browser language selects Turkish", () => {
  assert.equal(detectLocale(["tr-TR", "en"]), "tr");
  assert.equal(detectLocale(["en", "tr"]), "tr");
});

test("switching locale changes the translated string and falls back when missing", () => {
  setLocale("zh");
  assert.equal(translate("登录"), "登录");
  assert.equal(translate("没有这条译文"), "没有这条译文");
  setLocale("tr");
  assert.equal(translate("登录"), "Giriş yap");
  assert.equal(translate("没有这条译文"), "没有这条译文");
  assert.equal(translate("已删除 %{deleted} 条资产", { deleted: 4 }), "4 varlık silindi");
  setLocale("zh");
});

test("Turkish casing keeps dotted and dotless i distinct", () => {
  setLocale("tr");
  assert.equal(localeUpper("i"), "İ");
  assert.equal(localeLower("I"), "ı");
  assert.equal(localeUpper("ı"), "I");
  assert.equal(localeLower("İ"), "i");
  setLocale("zh");
  assert.equal(localeUpper("i"), "I");
  assert.notEqual(localeUpper("i"), "İ");
});

test("dates and numbers follow the active locale", () => {
  const date = new Date("2026-11-03T20:39:00Z");
  const options = { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" };
  setLocale("tr");
  assert.equal(formatDateTime(date, options), "03.11.2026");
  assert.match(formatNumber(1234567.5), /^1\.234\.567,5$/);
  setLocale("zh");
  assert.equal(formatDateTime(date, options), "2026/11/03");
  assert.match(formatNumber(1234567.5), /^1,234,567\.5$/);
});
