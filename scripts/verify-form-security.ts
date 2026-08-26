import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const { createFormToken } = await import("../src/lib/formSecurity");

const formKey = "simf-microsite-sponsorship";
const appURL = process.env.QA_APP_URL || "http://localhost:3004";
const token = createFormToken(formKey);
await new Promise((resolve) => setTimeout(resolve, 1600));

function requestData({
  honeypot = "",
  suppliedToken = token,
}: {
  honeypot?: string;
  suppliedToken?: string;
}) {
  const data = new FormData();
  data.set("_formKey", formKey);
  data.set("_locale", "en");
  data.set("_pagePath", "/sponsor");
  data.set("_token", suppliedToken);
  data.set("companyWebsite", honeypot);
  return data;
}

const [honeypot, invalidToken, wrongOrigin, missingOrigin] = await Promise.all([
  fetch(`${appURL}/api/forms/submit`, {
    method: "POST",
    body: requestData({ honeypot: "https://spam.example" }),
    headers: { origin: appURL },
  }),
  fetch(`${appURL}/api/forms/submit`, {
    method: "POST",
    body: requestData({ suppliedToken: "invalid" }),
    headers: { origin: appURL },
  }),
  fetch(`${appURL}/api/forms/submit`, {
    method: "POST",
    body: requestData({}),
    headers: { origin: "https://attacker.example" },
  }),
  fetch(`${appURL}/api/forms/submit`, {
    method: "POST",
    body: requestData({}),
  }),
]);

const result = {
  honeypot: honeypot.status,
  invalidToken: invalidToken.status,
  missingOrigin: missingOrigin.status,
  passed:
    honeypot.status === 200 &&
    invalidToken.status === 400 &&
    wrongOrigin.status === 403 &&
    missingOrigin.status === 403,
  wrongOrigin: wrongOrigin.status,
};

console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;
