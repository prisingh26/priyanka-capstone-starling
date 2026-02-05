 import React, { useEffect, useRef } from "react";
 
 interface FocusTrapProps {
   children: React.ReactNode;
   active?: boolean;
   returnFocusOnDeactivate?: boolean;
 }
 
 const FocusTrap: React.FC<FocusTrapProps> = ({
   children,
   active = true,
   returnFocusOnDeactivate = true,
 }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const previousActiveElement = useRef<HTMLElement | null>(null);
 
   useEffect(() => {
     if (!active) return;
 
     previousActiveElement.current = document.activeElement as HTMLElement;
 
     const container = containerRef.current;
     if (!container) return;
 
     const focusableElements = container.querySelectorAll<HTMLElement>(
       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
     );
 
     const firstElement = focusableElements[0];
     const lastElement = focusableElements[focusableElements.length - 1];
 
     // Focus first element
     firstElement?.focus();
 
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key !== "Tab") return;
 
       if (e.shiftKey) {
         if (document.activeElement === firstElement) {
           e.preventDefault();
           lastElement?.focus();
         }
       } else {
         if (document.activeElement === lastElement) {
           e.preventDefault();
           firstElement?.focus();
         }
       }
     };
 
     container.addEventListener("keydown", handleKeyDown);
 
     return () => {
       container.removeEventListener("keydown", handleKeyDown);
       if (returnFocusOnDeactivate && previousActiveElement.current) {
         previousActiveElement.current.focus();
       }
     };
   }, [active, returnFocusOnDeactivate]);
 
   return (
     <div ref={containerRef} role="region" aria-label="Focused content">
       {children}
     </div>
   );
 };
 
 export default FocusTrap;