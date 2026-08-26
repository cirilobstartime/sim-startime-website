"use client";

import React from "react";
import Link from "next/link";

export function FormSubmissionsExport() {
  return (
    <div className="startime-cms-export">
      <div>
        <strong>Export form submissions</strong>
        <p>
          Download every submission with form fields, conversion value, and
          first- and latest-touch campaign attribution.
        </p>
      </div>
      <Link
        className="startime-cms-export__button"
        href="/api/form-submissions/export"
      >
        Export CSV
      </Link>
    </div>
  );
}
