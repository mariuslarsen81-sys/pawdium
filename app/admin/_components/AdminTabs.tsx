"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/discovery",  label: "Contacts" },
  { href: "/admin/interviews", label: "Interviews" },
  { href: "/admin/insights",   label: "Insights" },
  { href: "/admin/templates",  label: "Templates" },
];

export default function AdminTabs() {
  const path = usePathname();

  return (
    <div className="flex gap-1 px-5 border-b border-plum-700 bg-plum-900">
      {TABS.map(t => {
        const active = path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{
              color: active ? "#C9A24A" : "rgba(216,208,195,0.45)",
              borderColor: active ? "#C9A24A" : "transparent",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
