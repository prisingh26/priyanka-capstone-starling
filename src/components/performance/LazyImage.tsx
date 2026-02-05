 import React, { useState, useRef, useEffect, memo } from "react";
 import { cn } from "@/lib/utils";
 
 interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   src: string;
   alt: string;
   placeholder?: string;
   blurDataURL?: string;
   priority?: boolean;
   onLoad?: () => void;
 }
 
 /**
  * Optimized image component with:
  * - Lazy loading (intersection observer)
  * - Blur placeholder
  * - Fade-in animation
  * - Error fallback
  */
 const LazyImage = memo<LazyImageProps>(({
   src,
   alt,
   placeholder,
   blurDataURL,
   priority = false,
   className,
   onLoad,
   ...props
 }) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [isInView, setIsInView] = useState(priority);
   const [error, setError] = useState(false);
   const imgRef = useRef<HTMLImageElement>(null);
 
   useEffect(() => {
     if (priority || !imgRef.current) return;
 
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsInView(true);
           observer.disconnect();
         }
       },
       { rootMargin: "50px", threshold: 0.01 }
     );
 
     observer.observe(imgRef.current);
     return () => observer.disconnect();
   }, [priority]);
 
   const handleLoad = () => {
     setIsLoaded(true);
     onLoad?.();
   };
 
   const handleError = () => {
     setError(true);
   };
 
   // Generate blur placeholder
   const placeholderSrc = blurDataURL || placeholder || 
     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E";
 
   if (error) {
     return (
       <div
         className={cn(
           "bg-muted flex items-center justify-center text-muted-foreground",
           className
         )}
         {...props}
       >
         <span className="text-sm">Failed to load</span>
       </div>
     );
   }
 
   return (
     <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
       {/* Blur placeholder */}
       {!isLoaded && (
         <img
           src={placeholderSrc}
           alt=""
           aria-hidden="true"
           className={cn(
             "absolute inset-0 w-full h-full object-cover blur-lg scale-110",
             className
           )}
         />
       )}
       {/* Actual image */}
       {isInView && (
         <img
           src={src}
           alt={alt}
           loading={priority ? "eager" : "lazy"}
           decoding="async"
           onLoad={handleLoad}
           onError={handleError}
           className={cn(
             "w-full h-full object-cover transition-opacity duration-300",
             isLoaded ? "opacity-100" : "opacity-0",
             className
           )}
           {...props}
         />
       )}
     </div>
   );
 });
 
 LazyImage.displayName = "LazyImage";
 
 export default LazyImage;