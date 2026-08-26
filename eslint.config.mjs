import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    ".next-stale-route-migration/**",
    ".runtime/**",
    "backups/**",
    "design-concepts/**",
    "node_modules/**",
    "qa-captures/**",
    "reference-assets/**",
    "reference-captures/**",
    "src/generated/**",
    "src/app/(payload)/content-admin/importMap.js",
    "tmp/**",
    "uploads/**",
  ]),
]);
