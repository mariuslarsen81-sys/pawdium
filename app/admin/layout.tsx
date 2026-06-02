import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./_components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-plum-900">
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-14 border-b border-plum-700 bg-plum-900/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/admin/discovery" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Pawdium" width={26} height={26} className="rounded-md" />
            <span className="text-sm font-bold tracking-wide gold-gradient">Pawdium</span>
          </Link>
          <span className="text-plum-600 select-none">·</span>
          <span className="text-sm text-stone/40 font-medium">Discovery CRM</span>
        </div>
        <LogoutButton />
      </nav>
      <div className="pt-14">{children}</div>
    </div>
  );
}
