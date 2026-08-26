import "@payloadcms/next/css";
import configPromise from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type { Metadata } from "next";
import type { ServerFunctionClient } from "payload";
import "@/styles/payload-admin.css";
import { importMap } from "./importMap";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function PayloadAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction,
  });
}
