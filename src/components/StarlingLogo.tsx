import React from "react";
import ShootingStarIcon from "./ShootingStarIcon";

interface StarlingLogoProps {
  onClick?: () => void;
  suffix?: string;
  className?: string;
}

const StarlingLogo: React.FC<StarlingLogoProps> = ({ onClick, suffix, className = "" }) => {
  const content = (
    <>
      <ShootingStarIcon size={48} />
      <span className="text-[40px] font-bold text-gradient-primary leading-normal">
        Starling{suffix ? ` ${suffix}` : ""}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {content}
    </div>
  );
};

export default StarlingLogo;
