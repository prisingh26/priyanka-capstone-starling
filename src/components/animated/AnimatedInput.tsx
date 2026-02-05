 import React, { useState, useId } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
   error?: string;
   isValid?: boolean;
   showPasswordStrength?: boolean;
 }
 
 const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
   let strength = 0;
   if (password.length >= 8) strength++;
   if (/[A-Z]/.test(password)) strength++;
   if (/[a-z]/.test(password)) strength++;
   if (/[0-9]/.test(password)) strength++;
   if (/[^A-Za-z0-9]/.test(password)) strength++;
 
   if (strength <= 2) return { level: strength, label: "Weak", color: "bg-destructive" };
   if (strength <= 3) return { level: strength, label: "Fair", color: "bg-warning" };
   if (strength <= 4) return { level: strength, label: "Good", color: "bg-primary" };
   return { level: strength, label: "Strong", color: "bg-success" };
 };
 
 const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
   (
     {
       className,
       type,
       label,
       error,
       isValid,
       showPasswordStrength = false,
       value,
       ...props
     },
     ref
   ) => {
     const [isFocused, setIsFocused] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
     const [hasShaken, setHasShaken] = useState(false);
     const id = useId();
 
     const hasValue = value !== undefined && value !== "";
     const isFloating = isFocused || hasValue;
     const isPassword = type === "password";
     const inputType = isPassword && showPassword ? "text" : type;
 
     const passwordStrength = showPasswordStrength && isPassword && typeof value === "string"
       ? getPasswordStrength(value)
       : null;
 
     // Trigger shake animation on error
     React.useEffect(() => {
       if (error && !hasShaken) {
         setHasShaken(true);
         setTimeout(() => setHasShaken(false), 500);
       }
     }, [error, hasShaken]);
 
     return (
       <motion.div
         className="relative w-full"
         animate={hasShaken ? { x: [-10, 10, -10, 10, 0] } : {}}
         transition={{ duration: 0.4 }}
       >
         {/* Floating Label */}
         <motion.label
           htmlFor={id}
           className={cn(
             "absolute left-3 pointer-events-none",
             "transition-colors duration-200",
             error ? "text-destructive" : isFocused ? "text-primary" : "text-muted-foreground"
           )}
           initial={false}
           animate={{
             top: isFloating ? -8 : 12,
             fontSize: isFloating ? 12 : 14,
             backgroundColor: isFloating ? "hsl(var(--background))" : "transparent",
             paddingLeft: isFloating ? 4 : 0,
             paddingRight: isFloating ? 4 : 0,
           }}
           transition={{ duration: 0.15 }}
         >
           {label}
         </motion.label>
 
         {/* Input */}
         <input
           id={id}
           ref={ref}
           type={inputType}
           value={value}
           className={cn(
             "flex h-12 w-full rounded-xl border-2 bg-background px-3 py-2 text-base",
             "ring-offset-background transition-all duration-200",
             "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
             "disabled:cursor-not-allowed disabled:opacity-50",
             error
               ? "border-destructive focus-visible:ring-destructive"
               : isFocused
               ? "border-primary"
               : "border-input",
             (isValid || isPassword) && "pr-10",
             className
           )}
           onFocus={(e) => {
             setIsFocused(true);
             props.onFocus?.(e);
           }}
           onBlur={(e) => {
             setIsFocused(false);
             props.onBlur?.(e);
           }}
           {...props}
         />
 
         {/* Status Icons */}
         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
           <AnimatePresence mode="wait">
             {isPassword && (
               <motion.button
                 type="button"
                 className="text-muted-foreground hover:text-foreground transition-colors p-1"
                 onClick={() => setShowPassword(!showPassword)}
                 whileTap={{ scale: 0.9 }}
               >
                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </motion.button>
             )}
             
             {error && (
               <motion.div
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 20, opacity: 0 }}
                 className="text-destructive"
               >
                 <AlertCircle className="w-4 h-4" />
               </motion.div>
             )}
             
             {isValid && !error && (
               <motion.div
                 initial={{ x: 20, opacity: 0, scale: 0 }}
                 animate={{ x: 0, opacity: 1, scale: 1 }}
                 exit={{ x: 20, opacity: 0, scale: 0 }}
                 className="text-success"
               >
                 <Check className="w-4 h-4" />
               </motion.div>
             )}
           </AnimatePresence>
         </div>
 
         {/* Error Message */}
         <AnimatePresence>
           {error && (
             <motion.p
               initial={{ opacity: 0, y: -10, height: 0 }}
               animate={{ opacity: 1, y: 0, height: "auto" }}
               exit={{ opacity: 0, y: -10, height: 0 }}
               className="text-sm text-destructive mt-1 ml-1"
             >
               {error}
             </motion.p>
           )}
         </AnimatePresence>
 
         {/* Password Strength Meter */}
         <AnimatePresence>
           {passwordStrength && hasValue && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               className="mt-2"
             >
               <div className="flex gap-1 h-1.5 mb-1">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <motion.div
                     key={i}
                     className={cn(
                       "flex-1 rounded-full",
                       i <= passwordStrength.level ? passwordStrength.color : "bg-muted"
                     )}
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: 1 }}
                     transition={{ delay: i * 0.05 }}
                   />
                 ))}
               </div>
               <p className="text-xs text-muted-foreground">
                 Password strength: <span className="font-medium">{passwordStrength.label}</span>
               </p>
             </motion.div>
           )}
         </AnimatePresence>
       </motion.div>
     );
   }
 );
 
 AnimatedInput.displayName = "AnimatedInput";
 
 export default AnimatedInput;