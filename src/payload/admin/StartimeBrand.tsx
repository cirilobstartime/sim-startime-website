import Image from "next/image";
import React from "react";

export function StartimeLogo() {
  return (
    <div className="startime-cms-logo">
      <Image
        alt="Saudi International Maritime Forum Content Studio"
        height="128"
        priority
        src="/assets/simf-microsite/organizers/simf-mark-blue.png"
        width="128"
      />
    </div>
  );
}

export function StartimeIcon() {
  return (
    <div className="startime-cms-icon">
      <Image
        alt="Saudi International Maritime Forum"
        height="44"
        src="/assets/simf-microsite/organizers/simf-mark-blue.png"
        width="44"
      />
    </div>
  );
}
