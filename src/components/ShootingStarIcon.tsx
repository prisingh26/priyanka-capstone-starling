import React from "react";

interface ShootingStarIconProps {
  className?: string;
  size?: number;
}

const ShootingStarIcon: React.FC<ShootingStarIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shooting star trail */}
    <path
      d="M2 2L9 9"
      stroke="url(#trail-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M5 1L10 7"
      stroke="url(#trail-gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M1 5L7 10"
      stroke="url(#trail-gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
    {/* Star */}
    <path
      d="M14 11l1.5 3.1 3.4.5-2.5 2.4.6 3.4L14 18.8l-3 1.6.6-3.4-2.5-2.4 3.4-.5L14 11z"
      fill="url(#star-gradient)"
      stroke="url(#star-gradient)"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
    {/* Sparkle dots */}
    <circle cx="18" cy="8" r="0.8" fill="#FBBF24" opacity="0.7" />
    <circle cx="20" cy="12" r="0.6" fill="#FBBF24" opacity="0.5" />
    <circle cx="16" cy="6" r="0.5" fill="#F59E0B" opacity="0.6" />
    <defs>
      <linearGradient id="trail-gradient" x1="0" y1="0" x2="10" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" stopOpacity="0.1" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="star-gradient" x1="11" y1="11" x2="17" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

export default ShootingStarIcon;
