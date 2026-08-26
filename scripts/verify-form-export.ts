import configPromise from "@payload-config";
import { getPayload } from "payload";
import { exportFormSubmissionsCSV } from "../src/payload/endpoints/exportFormSubmissionsCSV";

const payload = await getPayload({ config: configPromise });
const response = await exportFormSubmissionsCSV({
  payload,
  user: { id: 1 },
} as never);
const csv = await response.text();
const requiredColumns = [
  "reference",
  "formKey",
  "first_touch.utm_source",
  "latest_touch.utm_campaign",
  "form.email",
];
const passed =
  response.status === 200 &&
  response.headers.get("content-type")?.startsWith("text/csv") &&
  requiredColumns.every((column) => csv.includes(`\"${column}\"`));

console.log(
  JSON.stringify(
    {
      contentDisposition: response.headers.get("content-disposition"),
      passed,
      requiredColumnsPresent: Object.fromEntries(
        requiredColumns.map((column) => [
          column,
          csv.includes(`\"${column}\"`),
        ]),
      ),
      status: response.status,
    },
    null,
    2,
  ),
);

if (!passed) process.exitCode = 1;
process.exit();
