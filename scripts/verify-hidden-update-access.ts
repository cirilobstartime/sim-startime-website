import configPromise from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config: configPromise });
const seed = await payload.find({
  collection: "updates",
  limit: 1,
  locale: "en",
  overrideAccess: true,
});
const update = seed.docs[0];

if (!update) throw new Error("No update is available for access-control QA.");

await payload.update({
  collection: "updates",
  data: { visible: false },
  id: update.id,
  locale: "en",
  overrideAccess: true,
});

const [anonymousResult, staffResult] = await Promise.all([
  payload.find({
    collection: "updates",
    limit: 1,
    locale: "en",
    overrideAccess: false,
    where: { id: { equals: update.id } },
  }),
  payload.find({
    collection: "updates",
    limit: 1,
    locale: "en",
    overrideAccess: true,
    where: { id: { equals: update.id } },
  }),
]);

const passed =
  anonymousResult.totalDocs === 0 && staffResult.totalDocs === 1;

console.log(
  JSON.stringify({
    anonymousCount: anonymousResult.totalDocs,
    passed,
    staffCount: staffResult.totalDocs,
  }),
);

await payload.destroy();
if (!passed) process.exitCode = 1;
