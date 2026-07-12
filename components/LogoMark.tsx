export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="15" y="1" width="8" height="8" transform="rotate(45 16 5)" className="fill-orange-700" />
      <rect x="15" y="12" width="8" height="8" transform="rotate(45 16 16)" className="fill-indigo-900" />
      <rect x="15" y="23" width="8" height="8" transform="rotate(45 16 27)" className="fill-amber-500" />
    </svg>
  );
}
