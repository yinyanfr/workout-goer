import { useState, useRef, useEffect, useCallback } from "react";
import type { Locale } from "@/locales/index";
import { localeNames } from "@/locales/index";

interface Props {
  locale: Locale;
  onChange: (l: Locale) => void;
}

const FLAGS: Record<Locale, string> = {
  "zh-CN": "🇨🇳",
  "en-US": "🇺🇸",
  "fr-FR": "🇫🇷",
  "ja-JP": "🇯🇵",
};

const locales: Locale[] = ["zh-CN", "en-US", "fr-FR", "ja-JP"];

export default function LocaleSelect({ locale, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 6,
          cursor: "pointer",
          padding: "3px 8px",
          fontSize: 13,
          color: "inherit",
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {FLAGS[locale]} {localeNames[locale].split(" ")[0]}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 6,
            background: "rgba(30,30,40,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 4,
            minWidth: 130,
            backdropFilter: "blur(16px)",
            zIndex: 100,
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                onChange(l);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: l === locale ? "rgba(255,255,255,0.1)" : "none",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: "6px 10px",
                fontSize: 13,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {FLAGS[l]} {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
