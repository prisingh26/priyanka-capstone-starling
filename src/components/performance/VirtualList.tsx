 import React, { useState, useRef, useEffect, useCallback, memo } from "react";
 import { cn } from "@/lib/utils";
 
 interface VirtualListProps<T> {
   items: T[];
   itemHeight: number;
   renderItem: (item: T, index: number) => React.ReactNode;
   overscan?: number;
   className?: string;
   containerHeight?: number | string;
 }
 
 /**
  * Virtual scrolling list for rendering large datasets efficiently
  */
 function VirtualListInner<T>({
   items,
   itemHeight,
   renderItem,
   overscan = 3,
   className,
   containerHeight = 400,
 }: VirtualListProps<T>) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [scrollTop, setScrollTop] = useState(0);
 
   const totalHeight = items.length * itemHeight;
 
   const handleScroll = useCallback(() => {
     if (containerRef.current) {
       setScrollTop(containerRef.current.scrollTop);
     }
   }, []);
 
   useEffect(() => {
     const container = containerRef.current;
     if (!container) return;
 
     container.addEventListener("scroll", handleScroll, { passive: true });
     return () => container.removeEventListener("scroll", handleScroll);
   }, [handleScroll]);
 
   const containerHeightPx = typeof containerHeight === "number" 
     ? containerHeight 
     : containerRef.current?.clientHeight || 400;
 
   const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
   const endIndex = Math.min(
     items.length,
     Math.ceil((scrollTop + containerHeightPx) / itemHeight) + overscan
   );
 
   const visibleItems = items.slice(startIndex, endIndex);
   const offsetY = startIndex * itemHeight;
 
   return (
     <div
       ref={containerRef}
       className={cn("overflow-auto", className)}
       style={{ height: containerHeight }}
     >
       <div style={{ height: totalHeight, position: "relative" }}>
         <div
           style={{
             position: "absolute",
             top: offsetY,
             left: 0,
             right: 0,
           }}
         >
           {visibleItems.map((item, i) => (
             <div
               key={startIndex + i}
               style={{ height: itemHeight }}
             >
               {renderItem(item, startIndex + i)}
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 }
 
 export const VirtualList = memo(VirtualListInner) as typeof VirtualListInner;
 
 export default VirtualList;