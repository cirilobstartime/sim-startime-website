import type { Where } from "payload";

type CmsUser = {
  id?: number | string | null;
  role?: "administrator" | "editor" | null;
};

type AccessArgs = {
  req: {
    user?: CmsUser | null;
  };
};

export function authenticatedStaff({ req }: AccessArgs): boolean {
  return Boolean(req.user);
}

export function administratorsOnly({ req }: AccessArgs): boolean {
  return req.user?.role === "administrator";
}

export function administratorsOrSelf({
  req,
}: AccessArgs): boolean | Where {
  if (!req.user?.id) return false;
  if (req.user.role === "administrator") return true;
  return { id: { equals: req.user.id } };
}
