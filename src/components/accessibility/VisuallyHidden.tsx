 import React from "react";
 
 interface VisuallyHiddenProps {
   children: React.ReactNode;
   as?: keyof JSX.IntrinsicElements;
 }
 
 /**
  * Renders content that is visually hidden but accessible to screen readers.
  * Use this for providing additional context to assistive technologies.
  */
 const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
   children,
   as: Component = "span",
 }) => {
   return (
     <Component className="sr-only">
       {children}
     </Component>
   );
 };
 
 export default VisuallyHidden;