export default function DrawingFrame() {
  const corner = (
    <svg viewBox="0 0 16 16">
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <div className="frame" aria-hidden="true">
      <span className="cmark tl">{corner}</span>
      <span className="cmark tr">{corner}</span>
      <span className="cmark bl">{corner}</span>
      <span className="cmark br">{corner}</span>
      <span className="ruler left">
        <i>A</i><i>B</i><i>C</i><i>D</i>
      </span>
      <span className="ruler top">
        <i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i>
      </span>
    </div>
  );
}
