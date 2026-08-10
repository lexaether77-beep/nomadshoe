"use client";

export function SignOutButton() {
  async function handleSignOut() {
    try {
      // Overwrite the browser's cached Basic Auth credentials with bogus
      // ones so it stops auto-sending the real ones on the next request.
      await fetch("/admin", {
        headers: { Authorization: "Basic " + btoa("logout:logout") },
        cache: "no-store",
      });
    } catch {
      // ignore — we're navigating away regardless
    }
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full px-4 py-2 font-technical text-xs font-medium text-muted ring-1 ring-line hover:text-foreground"
    >
      Sign Out
    </button>
  );
}
