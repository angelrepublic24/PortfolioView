export default function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line className="hatch-line" x1="0" y1="0" x2="0" y2="7" />
        </pattern>
        <marker id="tick" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <line className="ink" x1="5" y1="1" x2="5" y2="9" strokeWidth="1.2" />
        </marker>
      </defs>
    </svg>
  );
}
