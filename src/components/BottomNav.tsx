"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "ホーム", icon: "home" },
  { href: "/quiz", label: "クイズ", icon: "quiz" },
  { href: "/practice", label: "直前対策", icon: "bolt" },
  { href: "/log", label: "ログ", icon: "bar_chart" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 safe-area-pb">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px", lineHeight: 1 }}
            >
              {tab.icon}
            </span>
            <span className={isActive ? "font-semibold" : ""}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
