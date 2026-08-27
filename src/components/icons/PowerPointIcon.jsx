export default function PowerPointIcon({ className = "w-6 h-6", size, style, ...props }) {
  const dimensionProps = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...dimensionProps}
      {...props}
    >
      <defs>
        {/* Main slide canvas gradient */}
        <linearGradient id="ppt-slide-grad" x1="18" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B42" />
          <stop offset="50%" stopColor="#EB3D1E" />
          <stop offset="100%" stopColor="#BA280E" />
        </linearGradient>

        {/* Front 'P' badge gradient */}
        <linearGradient id="ppt-badge-grad" x1="6" y1="12" x2="36" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E63B1C" />
          <stop offset="100%" stopColor="#9C1E09" />
        </linearGradient>

        {/* Glossy top highlight */}
        <linearGradient id="ppt-glass-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* 3D Drop shadow */}
        <filter id="ppt-shadow-filter" x="0" y="8" width="46" height="52" filterUnits="userSpaceOnUse">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Back Presentation Slide Canvas */}
      <rect
        x="18"
        y="7"
        width="40"
        height="50"
        rx="8"
        fill="url(#ppt-slide-grad)"
      />
      
      {/* Slide Glass Rim Highlight */}
      <rect
        x="18"
        y="7"
        width="40"
        height="50"
        rx="8"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.2"
      />

      {/* Slide Screen Inner Canvas */}
      <rect
        x="24"
        y="12"
        width="28"
        height="40"
        rx="4"
        fill="#821705"
        opacity="0.35"
      />

      {/* Presentation Header Line */}
      <rect
        x="28"
        y="17"
        width="20"
        height="3.5"
        rx="1.75"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Presentation Pie Slice 1 (Top-right quadrant) */}
      <path
        d="M39 25C43.97 25 48 29.03 48 34H39V25Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* Presentation Pie Slice 2 (Remaining 3/4 circle) */}
      <path
        d="M37 25V36H48C47.2 41 42.8 45 37 45C30.925 45 26 40.075 26 34C26 28.5 30.5 25.3 37 25Z"
        fill="#FFAE9C"
      />

      {/* Front PowerPoint 'P' Badge with realistic 3D shadow */}
      <g filter="url(#ppt-shadow-filter)">
        <rect
          x="6"
          y="13"
          width="32"
          height="38"
          rx="6"
          fill="url(#ppt-badge-grad)"
        />
        <rect
          x="6"
          y="13"
          width="32"
          height="38"
          rx="6"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.2"
        />
        {/* Subtle glass reflection on upper half of badge */}
        <rect
          x="6"
          y="13"
          width="32"
          height="19"
          rx="6"
          fill="url(#ppt-glass-grad)"
        />
      </g>

      {/* Bold White Letter "P" */}
      <path
        d="M15 20.5H23.2C26.4 20.5 28.8 22.5 28.8 25.6C28.8 28.7 26.4 30.7 23.2 30.7H19.2V43H15V20.5ZM19.2 24.2V27H22.8C24 27 24.7 26.4 24.7 25.6C24.7 24.8 24 24.2 22.8 24.2H19.2Z"
        fill="#FFFFFF"
        fillRule="evenodd"
      />
    </svg>
  );
}
