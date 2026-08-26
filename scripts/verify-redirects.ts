import configPromise from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config: configPromise });
const appURL = process.env.QA_APP_URL || "http://localhost:3004";
let redirectID: number | string | undefined;

try {
  const pages = await payload.find({
    collection: "pages",
    locale: "en",
    fallbackLocale: false,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { pageType: { equals: "simf-microsite-home" } },
        { visible: { equals: true } },
        { _status: { equals: "published" } },
      ],
    },
  });
  const home = pages.docs[0];
  if (!home) throw new Error("Published English home page was not found.");

  const created = await payload.create({
    collection: "redirects",
    overrideAccess: true,
    data: {
      active: true,
      fromPath: "/qa-old-wordpress-url",
      internalTitle: "Temporary redirect QA",
      permanent: true,
      sourceLocale: "en",
      targetPage: home.id,
    },
  });
  redirectID = created.id;

  const response = await fetch(`${appURL}/qa-old-wordpress-url`, {
    redirect: "manual",
  });
  const result = {
    location: response.headers.get("location"),
    passed:
      [301, 308].includes(response.status) &&
      response.headers.get("location") === "/",
    status: response.status,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} finally {
  if (redirectID !== undefined) {
    await payload.delete({
      collection: "redirects",
      id: redirectID,
      overrideAccess: true,
    });
  }
}
