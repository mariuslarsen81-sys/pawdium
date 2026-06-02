import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./_components/LogoutButton";
import AdminTabs from "./_components/AdminTabs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-plum-900">
      {/* Top bar */}
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
        <AdminTabs />
      </nav>
      {/* Offset for fixed nav (top bar 48px + tabs ~41px = ~89px) */}
      <div className="pt-[89px]">{children}</div>
    </div>
  );
}
