"use client";

import { FilePdf, Printer, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";
import type { Locale } from "@/content/types";

type ActionState = "idle" | "copied" | "exporting" | "error";

function safeFilename(value: string, locale: Locale) {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return `${normalized || (locale === "ar" ? "تحديث" : "update")}.pdf`;
}

export function SimfArticleActions({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const ar = locale === "ar";
  const [state, setState] = useState<ActionState>("idle");

  const labels = {
    copied: ar ? "تم نسخ الرابط" : "Link copied",
    error: ar ? "تعذر إنشاء ملف PDF. حاول مرة أخرى." : "The PDF could not be created. Please try again.",
    exporting: ar ? "جارٍ إنشاء الملف…" : "Creating PDF…",
    pdf: ar ? "تصدير PDF" : "Export PDF",
    print: ar ? "طباعة" : "Print",
    share: ar ? "مشاركة" : "Share",
  };

  async function shareArticle() {
    const shareData = { title, url: window.location.href };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("error");
    }
  }

  async function exportPdf() {
    const article = document.querySelector<HTMLElement>(".simf-update-article");
    if (!article || state === "exporting") return;

    setState("exporting");
    article.dataset.pdfExport = "true";

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(article, {
        backgroundColor: "#edf2f7",
        logging: false,
        scale: Math.min(window.devicePixelRatio || 1, 1.6),
        useCORS: true,
      });
      const pdf = new jsPDF({ format: "a4", orientation: "portrait", unit: "mm" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      const image = canvas.toDataURL("image/jpeg", 0.92);

      let remaining = imageHeight;
      let position = 0;
      pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight, undefined, "FAST");
      remaining -= pageHeight;

      while (remaining > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight, undefined, "FAST");
        remaining -= pageHeight;
      }

      pdf.save(safeFilename(title, locale));
      setState("idle");
    } catch {
      setState("error");
    } finally {
      delete article.dataset.pdfExport;
    }
  }

  return (
    <div className="simf-update-actions" role="group" aria-label={ar ? "خيارات التحديث" : "Article actions"}>
      <button data-track="update_share" onClick={shareArticle} title={labels.share} type="button">
        <ShareNetwork aria-hidden weight="regular" />
        <span>{labels.share}</span>
      </button>
      <button data-track="update_print" onClick={() => window.print()} title={labels.print} type="button">
        <Printer aria-hidden weight="regular" />
        <span>{labels.print}</span>
      </button>
      <button
        data-track="update_export_pdf"
        disabled={state === "exporting"}
        onClick={exportPdf}
        title={labels.pdf}
        type="button"
      >
        <FilePdf aria-hidden weight="regular" />
        <span>{state === "exporting" ? labels.exporting : labels.pdf}</span>
      </button>
      <span aria-live="polite" className="simf-update-actions__status" role="status">
        {state === "copied" ? labels.copied : state === "error" ? labels.error : ""}
      </span>
    </div>
  );
}
