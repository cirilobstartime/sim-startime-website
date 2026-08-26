import { countries as supportedCountryCodes } from "country-flag-icons";

const names = new Intl.DisplayNames(["en"], { type: "region" });

export const countryOptions = supportedCountryCodes
  .filter((code) => /^[A-Z]{2}$/.test(code))
  .map((code) => {
    let label = code;
    try {
      label = names.of(code) || code;
    } catch {
      // A small number of flag sets include non-ISO regional aliases.
    }
    return { label, value: code };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const legacyCountryCodes: Record<string, string> = {
  bahrain: "BH",
  canada: "CA",
  greece: "GR",
  india: "IN",
  japan: "JP",
  "new zealand": "NZ",
  pakistan: "PK",
  poland: "PL",
  "saudi arabia": "SA",
  singapore: "SG",
  switzerland: "CH",
  turkey: "TR",
  türkiye: "TR",
  "united kingdom": "GB",
  "united states": "US",
  البحرين: "BH",
  السعودية: "SA",
  "الولايات المتحدة": "US",
  اليابان: "JP",
  اليونان: "GR",
  باكستان: "PK",
  بولندا: "PL",
  تركيا: "TR",
  سنغافورة: "SG",
  سويسرا: "CH",
  كندا: "CA",
  "المملكة المتحدة": "GB",
  نيوزيلندا: "NZ",
  الهند: "IN",
};

const optionCodeByName = new Map(
  countryOptions.map((option) => [option.label.toLocaleLowerCase(), option.value]),
);

export function countryCodeFromValue(country?: string | null) {
  if (!country) return null;
  const normalized = country.trim();
  const upper = normalized.toUpperCase();
  if (supportedCountryCodes.includes(upper)) return upper;
  return (
    legacyCountryCodes[normalized.toLocaleLowerCase()] ||
    optionCodeByName.get(normalized.toLocaleLowerCase()) ||
    null
  );
}
