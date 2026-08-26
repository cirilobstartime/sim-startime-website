import configPromise from "@payload-config";
import { getPayload } from "payload";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error(
    "Set ADMIN_EMAIL and ADMIN_PASSWORD before running npm run create-admin.",
  );
}

const payload = await getPayload({ config: configPromise });
const existing = await payload.find({
  collection: "cms-users",
  limit: 1,
  overrideAccess: true,
  where: { email: { equals: email } },
});

if (existing.docs[0]) {
  await payload.update({
    collection: "cms-users",
    id: existing.docs[0].id,
    data: { password, role: "administrator" },
    overrideAccess: true,
  });
  console.log(`Updated administrator access: ${email}`);
} else {
  await payload.create({
    collection: "cms-users",
    data: { email, password, role: "administrator" },
    overrideAccess: true,
  });
  console.log(`Created admin: ${email}`);
}

process.exit(0);
