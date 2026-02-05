 import { useState, useEffect, useRef, RefObject } from "react";
 
 interface UseIntersectionObserverOptions extends IntersectionObserverInit {
   freezeOnceVisible?: boolean;
 }
 
 /**
  * Hook for lazy loading and visibility detection using IntersectionObserver
  */
 export function useIntersectionObserver<T extends Element>(
   options: UseIntersectionObserverOptions = {}
 ): [RefObject<T>, boolean] {
   const { threshold = 0, root = null, rootMargin = "0px", freezeOnceVisible = true } = options;
   
   const ref = useRef<T>(null);
   const [isVisible, setIsVisible] = useState(false);
 
   useEffect(() => {
     const element = ref.current;
     if (!element) return;
 
     // Skip if already visible and frozen
     if (freezeOnceVisible && isVisible) return;
 
     const observer = new IntersectionObserver(
       ([entry]) => {
         const visible = entry.isIntersecting;
         setIsVisible(visible);
         
         if (visible && freezeOnceVisible) {
           observer.disconnect();
         }
       },
       { threshold, root, rootMargin }
     );
 
     observer.observe(element);
 
     return () => observer.disconnect();
   }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);
 
   return [ref, isVisible];
 }
 
 export default useIntersectionObserver;