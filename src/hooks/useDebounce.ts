 import { useState, useEffect, useCallback, useRef } from "react";
 
 /**
  * Debounce a value - delays updating the value until after the delay
  */
 export function useDebounce<T>(value: T, delay: number): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);
 
   useEffect(() => {
     const timer = setTimeout(() => {
       setDebouncedValue(value);
     }, delay);
 
     return () => {
       clearTimeout(timer);
     };
   }, [value, delay]);
 
   return debouncedValue;
 }
 
 /**
  * Debounce a callback function
  */
 export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
   callback: T,
   delay: number
 ): T {
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const callbackRef = useRef(callback);
 
   // Update ref when callback changes
   useEffect(() => {
     callbackRef.current = callback;
   }, [callback]);
 
   const debouncedCallback = useCallback(
     (...args: Parameters<T>) => {
       if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
       }
 
       timeoutRef.current = setTimeout(() => {
         callbackRef.current(...args);
       }, delay);
     },
     [delay]
   ) as T;
 
   // Cleanup on unmount
   useEffect(() => {
     return () => {
       if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
       }
     };
   }, []);
 
   return debouncedCallback;
 }
 
 /**
  * Throttle a callback function - only execute once per delay period
  */
 export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
   callback: T,
   delay: number
 ): T {
   const lastRun = useRef<number>(0);
   const callbackRef = useRef(callback);
 
   useEffect(() => {
     callbackRef.current = callback;
   }, [callback]);
 
   const throttledCallback = useCallback(
     (...args: Parameters<T>) => {
       const now = Date.now();
       if (now - lastRun.current >= delay) {
         lastRun.current = now;
         callbackRef.current(...args);
       }
     },
     [delay]
   ) as T;
 
   return throttledCallback;
 }
 
 export default useDebounce;