import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Admin access is not configured", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [providedUser, providedPass] = atob(encoded).split(":");
      if (providedUser === user && providedPass === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="KLOT Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
