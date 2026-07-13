export default function Fringe({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  // A row of hand-knot tassels — the loom edge that finishes every
  // real zarbia rug. Used as a section seam instead of a plain rule.
  return (
    <div
      aria-hidden="true"
      className={`fringe ${flip ? "fringe-flip" : ""} ${className}`}
    />
  );
}