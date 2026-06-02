import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/api/admin/auth")) return NextResponse.next();

  const cookie = request.cookies.get("admin_auth");
  const expected = btoa(`pawdium:${process.env.ADMIN_PASSWORD ?? ""}`);
  const isAuth = cookie?.value === expected;

  if (!isAuth) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
