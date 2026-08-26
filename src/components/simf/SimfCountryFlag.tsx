import Image from "next/image";
import { countryCodeFromValue } from "@/content/countries";

export function SimfCountryFlag({
  className,
  country,
}: {
  className: string;
  country?: string | null;
}) {
  const code = countryCodeFromValue(country);
  if (!code) return null;
  return (
    <Image
      alt={country || code}
      className={className}
      height={30}
      src={`/assets/country-flags/3x2/${code}.svg`}
      unoptimized
      width={45}
    />
  );
}
