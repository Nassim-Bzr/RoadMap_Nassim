interface Props {
  size?: number
  mood?: 'happy' | 'neutral'
  className?: string
}

export default function FennecMascot({ size = 48, mood = 'happy', className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      {/* shadow */}
      <ellipse cx="50" cy="92" rx="26" ry="3.5" fill="rgba(0,0,0,0.10)" />
      {/* left ear */}
      <path d="M22 38 L18 8 L42 28 Z" fill="#FF8F66" stroke="#E54A28" strokeWidth="2" strokeLinejoin="round" />
      <path d="M26 32 L24 16 L36 26 Z" fill="#FFD8C9" />
      {/* right ear */}
      <path d="M78 38 L82 8 L58 28 Z" fill="#FF8F66" stroke="#E54A28" strokeWidth="2" strokeLinejoin="round" />
      <path d="M74 32 L76 16 L64 26 Z" fill="#FFD8C9" />
      {/* head */}
      <ellipse cx="50" cy="58" rx="30" ry="28" fill="#FF8F66" stroke="#E54A28" strokeWidth="2" />
      {/* muzzle */}
      <ellipse cx="50" cy="68" rx="20" ry="14" fill="#FFEFE6" />
      {/* eye patches */}
      <path d="M30 50 Q36 44 42 50 Q38 56 30 54 Z" fill="rgba(229,74,40,0.18)" />
      <path d="M70 50 Q64 44 58 50 Q62 56 70 54 Z" fill="rgba(229,74,40,0.18)" />
      {/* eyes */}
      <ellipse cx="38" cy="54" rx="4.5" ry="6" fill="#2D2843" />
      <ellipse cx="62" cy="54" rx="4.5" ry="6" fill="#2D2843" />
      <circle cx={mood === 'happy' ? 39 : 38} cy="52" r="1.6" fill="white" />
      <circle cx={mood === 'happy' ? 63 : 62} cy="52" r="1.6" fill="white" />
      {/* nose */}
      <ellipse cx="50" cy="64" rx="3" ry="2.4" fill="#2D2843" />
      {/* mouth */}
      <path d="M50 66 L50 70 M45 73 Q50 76 55 73" stroke="#2D2843" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* whisker spots */}
      <circle cx="38" cy="72" r="0.8" fill="#2D2843" opacity="0.4" />
      <circle cx="62" cy="72" r="0.8" fill="#2D2843" opacity="0.4" />
    </svg>
  )
}
