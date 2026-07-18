import { stackRows, type TechNode } from "@/lib/stack";

const NODE_W = 100;
const NODE_H = 30;
const ROW_H = 40;
const START_Y = 48;
const COL_X = [16, 182, 344];

function trunc(s: string, n = 15) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function Node({ x, y, node }: { x: number; y: number; node: TechNode }) {
  return (
    <g className="g-node">
      <rect className={`node-rect ${node.external ? "ext" : "owned"}`} x={x} y={y} width={NODE_W} height={NODE_H} rx="1" />
      <text x={x + 10} y={y + 19} fontSize="9.5" className={node.external ? "t-blue" : "t-ink"}>
        {trunc(node.label)}{node.external ? " ↗" : ""}
      </text>
    </g>
  );
}

export default function TopologyDiagram({ langs, name }: { langs: string[]; name: string }) {
  const rows = stackRows(langs);
  const A = rows.filter((r) => !r.external && (r.layer === "UI" || r.layer === "STATE"));
  const B = rows.filter((r) => !r.external && (r.layer === "API" || r.layer === "DOMAIN" || r.layer === "INFRA"));
  const Cown = rows.filter((r) => !r.external && r.layer === "DATA");
  const ext = rows.filter((r) => r.external);
  const C = [...Cown, ...ext];

  const cy = (i: number) => START_Y + i * ROW_H;
  const maxRows = Math.max(A.length, B.length, C.length, 1);
  const height = START_Y + maxRows * ROW_H + 6;

  const b0y = cy(0);
  const bly = cy(Math.max(B.length - 1, 0));
  const rightSourceY = B.length ? cy(Math.floor((B.length - 1) / 2)) : cy(Math.max(A.length - 1, 0));
  const rightSourceX = B.length ? COL_X[1] + NODE_W : COL_X[0] + NODE_W;

  return (
    <svg viewBox={`0 0 460 ${height}`} className="diag draw" role="img"
      aria-label={`${name} architecture topology: amber nodes are code owned, dashed blue nodes are external services integrated`}>
      <text x="16" y="24" fontSize="10" letterSpacing="1.5" className="t-ink">TOPOLOGY · OWNED VS INTEGRATED</text>

      {/* edges */}
      {A.map((_, i) => (
        <line key={`la${i}`} className="edge leaf" x1={COL_X[0] + NODE_W} y1={cy(i) + NODE_H / 2}
          x2={B.length ? COL_X[1] : COL_X[2]} y2={(B.length ? cy(0) : cy(0)) + NODE_H / 2} />
      ))}
      {B.length > 1 && (
        <line className="edge spine" x1={COL_X[1] + NODE_W / 2} y1={b0y + NODE_H / 2}
          x2={COL_X[1] + NODE_W / 2} y2={bly + NODE_H / 2} />
      )}
      {C.map((n, j) => (
        <line key={`rc${j}`} className={`edge ${n.external ? "ext" : "spine"}`}
          x1={rightSourceX} y1={rightSourceY + NODE_H / 2} x2={COL_X[2]} y2={cy(j) + NODE_H / 2} />
      ))}

      {/* nodes */}
      {A.map((n, i) => <Node key={n.key} x={COL_X[0]} y={cy(i)} node={n} />)}
      {B.map((n, i) => <Node key={n.key} x={COL_X[1]} y={cy(i)} node={n} />)}
      {C.map((n, i) => <Node key={n.key} x={COL_X[2]} y={cy(i)} node={n} />)}

      {rows.length === 0 && (
        <text x="16" y={START_Y + 10} fontSize="10">Stack not listed</text>
      )}
    </svg>
  );
}
