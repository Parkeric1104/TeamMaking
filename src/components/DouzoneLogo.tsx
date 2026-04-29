interface Props {
  height?: number;
}

export default function DouzoneLogo({ height = 36 }: Props) {
  const scale = height / 80;
  const w = Math.round(448 * scale);

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 448 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DOUZONE"
    >
      <text x="0"   y="74" fontFamily="'Arial Black','Impact',sans-serif" fontWeight="900" fontSize="78" fill="#111">D</text>
      <circle cx="90"  cy="40" r="36" fill="#00AADD" />
      <circle cx="90"  cy="40" r="19" fill="white" />
      <text x="128" y="74" fontFamily="'Arial Black','Impact',sans-serif" fontWeight="900" fontSize="78" fill="#111">UZ</text>
      <circle cx="286" cy="40" r="36" fill="#00AADD" />
      <circle cx="286" cy="40" r="19" fill="white" />
      <text x="325" y="74" fontFamily="'Arial Black','Impact',sans-serif" fontWeight="900" fontSize="78" fill="#111">NE</text>
    </svg>
  );
}
