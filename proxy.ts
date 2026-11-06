import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth/admin-email";

const LOGIN_PATH = "/admin/login";

export default auth((request) => {
  const signedIn = isAdminEmail(request.auth?.user?.email);
  const onLogin = request.nextUrl.pathname === LOGIN_PATH;

  if (!signedIn && !onLogin) return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  if (signedIn && onLogin) return NextResponse.redirect(new URL("/admin", request.nextUrl));
  return NextResponse.next();
});

export const config = { matcher: ["/admin", "/admin/:path*"] };
