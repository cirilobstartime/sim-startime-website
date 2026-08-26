import React from "react";

export function CmsDashboardIntro() {
  return (
    <section className="startime-cms-intro">
      <p className="startime-cms-intro__eyebrow">STARTIME CONTENT STUDIO</p>
      <h1>English and Arabic, independently controlled.</h1>
      <p>
        Select a language at the top of a document before editing. Draft and
        publish only that language; the other language keeps its own content,
        section order, and publication state.
      </p>
      <div className="startime-cms-intro__steps">
        <span>Choose locale</span>
        <span>Edit sections</span>
        <span>Preview or publish</span>
      </div>
    </section>
  );
}
