"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

const CHECK_INTERVAL_MS = 60_000;
const PUBLIC_ADMIN_ROUTES = [
  "/content-admin/login",
  "/content-admin/forgot",
  "/content-admin/reset",
  "/content-admin/logout",
];

function isPublicAdminRoute(pathname: string) {
  return PUBLIC_ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

export function CmsSessionGuard({ children }: { children?: ReactNode }) {
  useEffect(() => {
    let checking = false;
    let stopped = false;

    async function checkSession() {
      const { pathname, search } = window.location;
      if (checking || isPublicAdminRoute(pathname)) return;
      checking = true;

      try {
        const response = await fetch("/api/cms-users/me", {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });
        const result = response.ok
          ? ((await response.json().catch(() => null)) as {
              user?: unknown;
            } | null)
          : null;

        if (
          !stopped &&
          (response.status === 401 ||
            response.status === 403 ||
            (response.ok && !result?.user))
        ) {
          const redirect = encodeURIComponent(`${pathname}${search}`);
          window.location.replace(`/content-admin/login?redirect=${redirect}`);
        }
      } catch {
        // A temporary network failure should not eject an authenticated editor.
      } finally {
        checking = false;
      }
    }

    const checkVisibleSession = () => {
      if (document.visibilityState === "visible") void checkSession();
    };

    void checkSession();
    const interval = window.setInterval(checkSession, CHECK_INTERVAL_MS);
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkVisibleSession);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkVisibleSession);
    };
  }, []);

  return children;
}
