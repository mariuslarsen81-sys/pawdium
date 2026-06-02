"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-stone/35 hover:text-stone/60 transition-colors"
    >
      Sign out
    </button>
  );
}
