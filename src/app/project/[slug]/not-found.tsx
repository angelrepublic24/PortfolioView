import Link from "next/link";
import DrawingFrame from "@/components/drawingset/DrawingFrame";

export default function ProjectNotFound() {
  return (
    <div className="drawing-set">
      <DrawingFrame />
      <main>
        <section className="sheet" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="sheet-tag">
            <span className="no">404</span> Sheet not found <span className="rule" />
          </div>
          <h1 className="proj-name xl">This sheet isn&apos;t in the set.</h1>
          <p className="proj-sub">It may have been withdrawn or renamed.</p>
          <div className="sheet-actions">
            <Link className="btn primary" href="/#work">Back to the set →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
