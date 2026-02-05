 /**
  * Image optimization utilities
  */
 
 interface CompressOptions {
   maxWidth?: number;
   maxHeight?: number;
   quality?: number;
   type?: "image/jpeg" | "image/webp" | "image/png";
 }
 
 /**
  * Compress an image file client-side before upload
  */
 export async function compressImage(
   file: File,
   options: CompressOptions = {}
 ): Promise<Blob> {
   const {
     maxWidth = 1920,
     maxHeight = 1080,
     quality = 0.8,
     type = "image/webp",
   } = options;
 
   return new Promise((resolve, reject) => {
     const img = new Image();
     img.onload = () => {
       // Calculate new dimensions
       let { width, height } = img;
       
       if (width > maxWidth) {
         height = (height * maxWidth) / width;
         width = maxWidth;
       }
       
       if (height > maxHeight) {
         width = (width * maxHeight) / height;
         height = maxHeight;
       }
 
       // Create canvas and draw resized image
       const canvas = document.createElement("canvas");
       canvas.width = width;
       canvas.height = height;
       
       const ctx = canvas.getContext("2d");
       if (!ctx) {
         reject(new Error("Could not get canvas context"));
         return;
       }
 
       ctx.drawImage(img, 0, 0, width, height);
 
       // Convert to blob
       canvas.toBlob(
         (blob) => {
           if (blob) {
             resolve(blob);
           } else {
             reject(new Error("Could not compress image"));
           }
         },
         type,
         quality
       );
     };
 
     img.onerror = () => reject(new Error("Could not load image"));
     img.src = URL.createObjectURL(file);
   });
 }
 
 /**
  * Generate a tiny blur placeholder from an image
  */
 export async function generateBlurPlaceholder(file: File): Promise<string> {
   return new Promise((resolve) => {
     const img = new Image();
     img.onload = () => {
       // Create tiny canvas (10x10)
       const canvas = document.createElement("canvas");
       canvas.width = 10;
       canvas.height = 10;
       
       const ctx = canvas.getContext("2d");
       if (!ctx) {
         resolve("");
         return;
       }
 
       ctx.drawImage(img, 0, 0, 10, 10);
       resolve(canvas.toDataURL("image/jpeg", 0.5));
     };
 
     img.onerror = () => resolve("");
     img.src = URL.createObjectURL(file);
   });
 }
 
 /**
  * Generate responsive srcset for images
  */
 export function generateSrcSet(baseUrl: string, widths: number[] = [320, 640, 1024, 1920]): string {
   return widths
     .map((w) => `${baseUrl}?w=${w} ${w}w`)
     .join(", ");
 }
 
 /**
  * Check if browser supports WebP
  */
 export async function supportsWebP(): Promise<boolean> {
   if (typeof window === "undefined") return false;
   
   const webpData = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   
   return new Promise((resolve) => {
     const img = new Image();
     img.onload = () => resolve(img.width > 0 && img.height > 0);
     img.onerror = () => resolve(false);
     img.src = webpData;
   });
 }
 
 /**
  * Check if browser supports AVIF
  */
 export async function supportsAVIF(): Promise<boolean> {
   if (typeof window === "undefined") return false;
   
   const avifData = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIAAAAISAAACNg=";
   
   return new Promise((resolve) => {
     const img = new Image();
     img.onload = () => resolve(img.width > 0 && img.height > 0);
     img.onerror = () => resolve(false);
     img.src = avifData;
   });
 }