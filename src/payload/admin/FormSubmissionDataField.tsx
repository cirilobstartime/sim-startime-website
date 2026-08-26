import type { JSONFieldServerProps } from "payload";

type DisplayRow = {
  label: string;
  path: string;
  value: string;
};

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function displayValue(value: unknown, arabic: boolean) {
  if (typeof value === "boolean") {
    return value ? (arabic ? "نعم" : "Yes") : arabic ? "لا" : "No";
  }
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function flattenValue(
  value: unknown,
  arabic: boolean,
  labels: Map<string, string>,
  prefix = "",
): DisplayRow[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenValue(item, arabic, labels, `${prefix}.${index + 1}`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (child && typeof child === "object") {
        return flattenValue(child, arabic, labels, path);
      }
      return [
        {
          label: labels.get(path) || labels.get(key) || humanize(path),
          path,
          value: displayValue(child, arabic),
        },
      ];
    });
  }
  return [
    {
      label: humanize(prefix || "value"),
      path: prefix || "value",
      value: displayValue(value, arabic),
    },
  ];
}

export async function FormSubmissionDataField({
  field,
  payload,
  siblingData,
  value,
}: JSONFieldServerProps) {
  const arabic = siblingData.locale === "ar";
  const labels = new Map<string, string>();
  const formRelationship = siblingData.form;
  const formID =
    formRelationship && typeof formRelationship === "object"
      ? (formRelationship as { id?: number | string }).id
      : formRelationship;

  if (field.name === "data" && formID !== null && formID !== undefined) {
    try {
      const form = await payload.findByID({
        collection: "forms",
        depth: 0,
        fallbackLocale: false,
        id: formID as number | string,
        locale: arabic ? "ar" : "en",
        overrideAccess: true,
      });
      for (const formField of form.fields || []) {
        labels.set(formField.name, formField.label || humanize(formField.name));
      }
    } catch {
      // The stored field names remain readable if the related form is unavailable.
    }
  }

  const rows = flattenValue(value, arabic, labels);
  const title =
    typeof field.label === "string" ? field.label : humanize(field.name);

  return (
    <section className="startime-submission-data" data-field-path={field.name}>
      <div className="startime-submission-data__heading">
        <h3>{title}</h3>
        <p>
          {arabic
            ? "بيانات للقراءة فقط كما أرسلها المستخدم."
            : "Read-only data exactly as submitted by the user."}
        </p>
      </div>
      <dl className="startime-submission-data__rows">
        {rows.length ? (
          rows.map((row) => (
            <div className="startime-submission-data__row" key={row.path}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))
        ) : (
          <div className="startime-submission-data__row">
            <dt>{arabic ? "البيانات" : "Data"}</dt>
            <dd>{arabic ? "لا توجد بيانات" : "No data submitted"}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
