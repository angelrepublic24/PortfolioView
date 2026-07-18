import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "Angel Almonte — Full-Stack Software Developer & Founder";

// Share/OG card rendered in the Drawing-Set aesthetic (graphite + amber, drafting
// frame + title block). Replaces the old logo image so link previews match the site.
export function renderOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#14171B",
          color: "#E6E7E1",
          fontFamily: "monospace",
          padding: 68,
          position: "relative",
        }}
      >
        {/* drafting frame */}
        <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: "1px solid #333A42", display: "flex" }} />

        {/* stacked-slab section motif, top-right */}
        <div style={{ position: "absolute", top: 96, right: 104, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 132, height: 17, backgroundColor: "#F2A63C", marginBottom: 11, display: "flex" }} />
          <div style={{ width: 132, height: 17, backgroundColor: "#C68A34", marginBottom: 11, display: "flex" }} />
          <div style={{ width: 132, height: 17, backgroundColor: "#7C5A28", display: "flex" }} />
        </div>

        {/* main block */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#8B919A" }}>A. ALMONTE · SHEET 00 — COVER</div>
          <div style={{ display: "flex", fontSize: 94, fontWeight: 700, marginTop: 18, lineHeight: 1 }}>Angel Almonte</div>
          <div style={{ display: "flex", fontSize: 31, color: "#F2A63C", marginTop: 16, letterSpacing: 2 }}>Full-Stack Software Developer &amp; Founder</div>
          <div style={{ display: "flex", fontSize: 26, color: "#8B919A", marginTop: 30 }}>Every floor of the stack, built by one hand.</div>
        </div>

        {/* title block row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: "#8B919A" }}>NEW JERSEY, USA</div>
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: "#8B919A" }}>REV 2026.07</div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
