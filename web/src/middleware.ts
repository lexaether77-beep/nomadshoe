import { NextResponse, type NextRequest } from "next/server";
import { checkAdminBasicAuth } from "@/lib/auth";

export function middleware(request: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    return new NextResponse("Admin access is not configured", { status: 503 });
  }

  if (checkAdminBasicAuth(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="KLOT Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
