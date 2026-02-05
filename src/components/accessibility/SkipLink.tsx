 import React from "react";
 
 interface SkipLinkProps {
   targetId?: string;
   label?: string;
 }
 
 const SkipLink: React.FC<SkipLinkProps> = ({
   targetId = "main-content",
   label = "Skip to main content",
 }) => {
   const handleClick = (e: React.MouseEvent) => {
     e.preventDefault();
     const target = document.getElementById(targetId);
     if (target) {
       target.focus();
       target.scrollIntoView({ behavior: "smooth" });
     }
   };
 
   return (
     <a
       href={`#${targetId}`}
       onClick={handleClick}
       className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
     >
       {label}
     </a>
   );
 };
 
 export default SkipLink;