function splitLegacyCredentials(value: string) {
  const normalized = value.trim();
  const knownRoles: Record<string, { role: string; workplace: string }> = {
    "Chief of the General Staff": {
      role: "Chief of the General Staff",
      workplace: "Saudi Armed Forces",
    },
    "Vice Chief of the General Staff": {
      role: "Vice Chief of the General Staff",
      workplace: "Saudi Armed Forces",
    },
    "Chief of Staff of the Royal Saudi Naval Forces": {
      role: "Chief of Staff",
      workplace: "Royal Saudi Naval Forces",
    },
    "رئيس هيئة الأركان العامة": {
      role: "رئيس هيئة الأركان العامة",
      workplace: "القوات المسلحة السعودية",
    },
    "نائب رئيس هيئة الأركان العامة": {
      role: "نائب رئيس هيئة الأركان العامة",
      workplace: "القوات المسلحة السعودية",
    },
    "رئيس أركان القوات البحرية الملكية السعودية": {
      role: "رئيس الأركان",
      workplace: "القوات البحرية الملكية السعودية",
    },
  };
  if (knownRoles[normalized]) return knownRoles[normalized];

  const separator = Math.max(value.lastIndexOf(","), value.lastIndexOf("،"));
  if (separator < 0) return { role: normalized, workplace: "" };
  return {
    role: value.slice(0, separator).trim(),
    workplace: value.slice(separator + 1).trim(),
  };
}

export function SimfSpeakerRole({
  value,
  workplace,
}: {
  value: string;
  workplace?: string | null;
}) {
  const legacy = splitLegacyCredentials(value);
  const role = workplace ? value.trim() : legacy.role;
  const organization = workplace?.trim() || legacy.workplace;
  return (
    <p className="simf-speaker-role">
      {role ? <strong>{role}</strong> : null}
      {organization ? <span>{organization}</span> : null}
    </p>
  );
}
