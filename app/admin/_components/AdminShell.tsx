"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const TABS = [
  { href: "/admin/discovery",  label: "Contacts" },
  { href: "/admin/interviews", label: "Interviews" },
  { href: "/admin/insights",   label: "Insights" },
  { href: "/admin/templates",  label: "Templates" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLogin = path === "/admin/login";

  return (
    <>
      {!isLogin && (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-plum-700 bg-plum-900/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-5 h-12">
            <div className="flex items-center gap-3">
              <Link href="/admin/discovery" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Pawdium" width={24} height={24} className="rounded-md" />
                <span className="text-sm font-bold tracking-wide gold-gradient">Pawdium</span>
              </Link>
              <span className="text-plum-600 select-none text-sm">·</span>
              <span className="text-sm text-stone/35 font-medium">Discovery CRM</span>
            </div>
            <LogoutButton />
          </div>
          <div className="flex gap-1 px-5 border-b border-plum-700 bg-plum-900">
            {TABS.map(t => {
              const active = path.startsWith(t.href);
              return (
                <Link key={t.href} href={t.href}
                  className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
                  style={{
                    color: active ? "#C9A24A" : "rgba(216,208,195,0.45)",
                    borderColor: active ? "#C9A24A" : "transparent",
                  }}>
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      <div className={!isLogin ? "pt-[89px]" : ""}>{children}</div>
    </>
  );
}
