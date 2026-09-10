import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

export const PUBLIC_CACHE_TAGS = {
  marketing: "simf-marketing",
  pages: "simf-pages",
  siteSettings: "simf-site-settings",
  updates: "simf-updates",
} as const;

type PublicCacheTag =
  (typeof PUBLIC_CACHE_TAGS)[keyof typeof PUBLIC_CACHE_TAGS];

function invalidateTags(tags: readonly PublicCacheTag[], req: PayloadRequest) {
  try {
    for (const tag of tags) {
      // Immediate expiry keeps the next public request consistent with the CMS
      // save while retaining the fast cross-request data cache between edits.
      revalidateTag(tag, { expire: 0 });
    }
  } catch (error) {
    // Payload is also used by CLI maintenance scripts, which do not always run
    // inside a Next.js request context. A missing cache context must never make
    // a CMS save, upload, import, or deployment fail.
    if (
      error instanceof Error &&
      error.message.includes("static generation store missing")
    ) {
      return;
    }
    req.payload.logger.warn({
      err: error,
      msg: `Public cache invalidation skipped for ${tags.join(", ")}`,
    });
  }
}

export function revalidateCollectionAfterChange(
  tags: readonly PublicCacheTag[],
): CollectionAfterChangeHook {
  return ({ doc, req }) => {
    invalidateTags(tags, req);
    return doc;
  };
}

export function revalidateCollectionAfterDelete(
  tags: readonly PublicCacheTag[],
): CollectionAfterDeleteHook {
  return ({ doc, req }) => {
    invalidateTags(tags, req);
    return doc;
  };
}

export function revalidateGlobalAfterChange(
  tags: readonly PublicCacheTag[],
): GlobalAfterChangeHook {
  return ({ doc, req }) => {
    invalidateTags(tags, req);
    return doc;
  };
}
