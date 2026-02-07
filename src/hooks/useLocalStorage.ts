 import { useState, useEffect, useCallback } from "react";
 
 /**
  * Hook for syncing state with localStorage
  * Includes JSON serialization/deserialization
  */
 export function useLocalStorage<T>(
   key: string,
   initialValue: T
 ): [T, (value: T | ((prev: T) => T)) => void, () => void] {
   // Get initial value from localStorage or use provided default
  const [storedValue, setStoredValue] = useState<T>(() => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return initialValue;
        const parsed = JSON.parse(item);
        // Basic type check: if initialValue is an object, ensure parsed is also an object
        if (typeof initialValue === 'object' && initialValue !== null) {
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed) !== Array.isArray(initialValue)) {
            return initialValue;
          }
        }
        return parsed as T;
      } catch {
        return initialValue;
      }
    });
 
   // Update localStorage when state changes
   useEffect(() => {
     try {
       localStorage.setItem(key, JSON.stringify(storedValue));
     } catch (error) {
       console.warn(`Failed to save to localStorage: ${key}`, error);
     }
   }, [key, storedValue]);
 
   // Listen for changes in other tabs
   useEffect(() => {
     const handleStorageChange = (e: StorageEvent) => {
       if (e.key === key && e.newValue) {
         try {
           setStoredValue(JSON.parse(e.newValue));
         } catch {
           // Ignore parse errors
         }
       }
     };
 
     window.addEventListener("storage", handleStorageChange);
     return () => window.removeEventListener("storage", handleStorageChange);
   }, [key]);
 
   // Remove from storage
   const remove = useCallback(() => {
     localStorage.removeItem(key);
     setStoredValue(initialValue);
   }, [key, initialValue]);
 
   return [storedValue, setStoredValue, remove];
 }
 
 export default useLocalStorage;