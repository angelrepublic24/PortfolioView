import type { SectionFloor } from "./siteContent";

const START = 52;
const STEP = 42;
const SLAB_H = 40;

export default function SectionCut({ floors }: { floors: SectionFloor[] }) {
  const n = floors.length || 1;
  const bottom = START + (n - 1) * STEP + SLAB_H;
  const vbH = bottom + 58;

  return (
    <figure className="sectioncut reveal" style={{ margin: 0 }}>
      <svg viewBox={`0 0 440 ${vbH}`} className="diag draw" role="img"
        aria-label="Stack-depth section cut: the software stack drawn as stacked floor slabs, owned end to end">
        <text x="20" y="24" fontSize="11" letterSpacing="2" className="t-ink">SECTION A–A · STACK DEPTH</text>
        <text x="20" y="38" fontSize="9" letterSpacing="1.5">SCALE: N.T.S.</text>
        {floors.map((f, i) => {
          const y = START + i * STEP;
          const ext = (f.techBottom || "").includes("*");
          return (
            <g key={f.label + i}>
              <rect x="120" y={y} width="210" height={SLAB_H} className="slabfill ln" strokeWidth="1.3" />
              <rect x="120" y={y} width="210" height={SLAB_H} fill="url(#hatch)" stroke="none" />
              <text x="128" y={y + 24} fontSize="12" className="t-ink" letterSpacing="1.5">{f.label}</text>
              <line className="leaf edge" x1="120" y1={y + 20} x2="70" y2={y + 20} />
              <text x="14" y={y + 17} fontSize="8.5">{f.techTop}</text>
              <text x="14" y={y + 27} fontSize="8.5" className={ext ? "t-blue" : undefined}>{f.techBottom}</text>
            </g>
          );
        })}
        <g>
          <line className="ink" x1="360" y1={START} x2="360" y2={bottom} strokeWidth="1" markerStart="url(#tick)" markerEnd="url(#tick)" />
          <line className="ln" x1="330" y1={START} x2="364" y2={START} strokeWidth="1" />
          <line className="ln" x1="330" y1={bottom} x2="364" y2={bottom} strokeWidth="1" />
          <path className="amber" d={`M392 ${START} h10 v${bottom - START} h-10`} fill="none" strokeWidth="2" />
          <text x="420" y={(START + bottom) / 2} fontSize="11" className="t-amber" letterSpacing="2"
            transform={`rotate(90 420 ${(START + bottom) / 2})`} textAnchor="middle">OWNED END TO END</text>
        </g>
        <text x="20" y={bottom + 28} fontSize="8.5">* BLUE = EXTERNAL SERVICE INTEGRATED, NOT OWNED</text>
      </svg>
    </figure>
  );
}
