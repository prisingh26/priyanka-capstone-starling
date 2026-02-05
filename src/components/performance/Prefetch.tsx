 import React, { useEffect, useRef, useState } from "react";
 
 interface PrefetchProps {
   /** URL or import function to prefetch */
   load: () => Promise<unknown>;
   /** Trigger prefetch on hover (default true) */
   onHover?: boolean;
   /** Trigger prefetch when in viewport */
   onVisible?: boolean;
   children: React.ReactNode;
 }
 
 /**
  * Prefetch component that loads resources on hover or when visible
  */
 const Prefetch: React.FC<PrefetchProps> = ({
   load,
   onHover = true,
   onVisible = false,
   children,
 }) => {
   const ref = useRef<HTMLDivElement>(null);
   const [prefetched, setPrefetched] = useState(false);
 
   const prefetch = () => {
     if (!prefetched) {
       load();
       setPrefetched(true);
     }
   };
 
   // Prefetch on visibility
   useEffect(() => {
     if (!onVisible || !ref.current) return;
 
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           prefetch();
           observer.disconnect();
         }
       },
       { rootMargin: "100px" }
     );
 
     observer.observe(ref.current);
     return () => observer.disconnect();
   }, [onVisible]);
 
   return (
     <div
       ref={ref}
       onMouseEnter={onHover ? prefetch : undefined}
       onFocus={onHover ? prefetch : undefined}
     >
       {children}
     </div>
   );
 };
 
 export default Prefetch;