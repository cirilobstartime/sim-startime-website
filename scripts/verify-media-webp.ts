import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const testRoot = await mkdtemp(path.join(os.tmpdir(), "simf-media-pipeline-"));
const mediaDir = path.join(testRoot, "media");

process.env.DATABASE_URL = `file:${path.join(testRoot, "test.db")}`;
process.env.MEDIA_UPLOAD_DIR = mediaDir;
process.env.NEXT_PUBLIC_APP_URL ||= "http://localhost:3004";

const [{ getPayload }, { default: configPromise }] = await Promise.all([
  import("payload"),
  import("../payload.config"),
]);

const payload = await getPayload({ config: configPromise });
const { default: sharp } = await import("sharp");
const sourcePath = path.resolve(
  "public/assets/simf-microsite/organizers/simf-mark-transparent.png",
);

try {
  const doc = await payload.create({
    collection: "media",
    data: {
      alt: "Disposable WebP pipeline verification",
      title: "Disposable WebP pipeline verification",
      usageNotes: "Temporary automated conversion check",
    },
    filePath: sourcePath,
    locale: "en",
    overrideAccess: true,
  });
  const files = await readdir(mediaDir);
  const nonWebPFiles = files.filter(
    (filename) => !filename.toLowerCase().endsWith(".webp"),
  );
  const sourceMetadata = await sharp(sourcePath).metadata();
  const outputMetadata = await sharp(
    path.join(mediaDir, String(doc.filename)),
  ).metadata();

  if (
    doc.mimeType !== "image/webp" ||
    nonWebPFiles.length > 0 ||
    sourceMetadata.width !== outputMetadata.width ||
    sourceMetadata.height !== outputMetadata.height ||
    (sourceMetadata.hasAlpha && !outputMetadata.hasAlpha)
  ) {
    throw new Error(
      `WebP conversion failed: ${JSON.stringify({
        files,
        filename: doc.filename,
        mimeType: doc.mimeType,
        outputMetadata,
        sourceMetadata,
      })}`,
    );
  }

  console.log(
    JSON.stringify({
      files,
      filename: doc.filename,
      mimeType: doc.mimeType,
      preservedAlpha: sourceMetadata.hasAlpha === outputMetadata.hasAlpha,
      preservedDimensions:
        sourceMetadata.width === outputMetadata.width &&
        sourceMetadata.height === outputMetadata.height,
      persistentDirectoryOverrideVerified: true,
    }),
  );
} finally {
  await payload.destroy();
  if (path.basename(testRoot).startsWith("simf-media-pipeline-")) {
    await rm(testRoot, { force: true, recursive: true });
  }
}
