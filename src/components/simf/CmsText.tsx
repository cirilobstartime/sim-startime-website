import { Fragment } from "react";

const CMS_LINE_BREAK = /(?:<br\s*\/?>|<\/br\s*>|<br\b(?![^<>]*>))/gi;

/**
 * Render editor-authored line-break markers without interpreting arbitrary
 * HTML. React continues to escape every other character in the CMS value.
 */
export function CmsText({ value }: { value: string }) {
  const lines = value.split(CMS_LINE_BREAK);

  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}
