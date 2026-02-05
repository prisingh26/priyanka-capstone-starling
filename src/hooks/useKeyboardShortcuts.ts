 import { useEffect, useCallback } from "react";
 
 interface ShortcutConfig {
   key: string;
   ctrl?: boolean;
   alt?: boolean;
   shift?: boolean;
   action: () => void;
   description: string;
 }
 
 interface UseKeyboardShortcutsOptions {
   enabled?: boolean;
   shortcuts: ShortcutConfig[];
 }
 
 export const useKeyboardShortcuts = ({
   enabled = true,
   shortcuts,
 }: UseKeyboardShortcutsOptions) => {
   const handleKeyDown = useCallback(
     (e: KeyboardEvent) => {
       if (!enabled) return;
 
       // Don't trigger shortcuts when typing in inputs
       const target = e.target as HTMLElement;
       if (
         target.tagName === "INPUT" ||
         target.tagName === "TEXTAREA" ||
         target.isContentEditable
       ) {
         return;
       }
 
       for (const shortcut of shortcuts) {
         const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
         const altMatch = shortcut.alt ? e.altKey : !e.altKey;
         const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
         const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
 
         if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
           e.preventDefault();
           shortcut.action();
           break;
         }
       }
     },
     [enabled, shortcuts]
   );
 
   useEffect(() => {
     document.addEventListener("keydown", handleKeyDown);
     return () => document.removeEventListener("keydown", handleKeyDown);
   }, [handleKeyDown]);
 
   return shortcuts;
 };
 
 export default useKeyboardShortcuts;