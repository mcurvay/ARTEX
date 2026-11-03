"use client";

import { useSyncExternalStore } from "react";

import { Languages } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isAppLocale, translate } from "@/i18n";
import { getLocale, getServerLocale, setLocale, subscribe } from "@/i18n/runtime";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useSyncExternalStore(subscribe, getLocale, getServerLocale);

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        if (isAppLocale(value)) setLocale(value);
      }}
    >
      <SelectTrigger aria-label={translate("界面语言")} className={cn("w-[8.5rem]", className)} size="sm">
        <Languages />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="tr">Türkçe</SelectItem>
      </SelectContent>
    </Select>
  );
}
