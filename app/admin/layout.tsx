import AdminShell from "./_components/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-plum-900">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
