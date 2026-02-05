 /**
  * Web Vitals monitoring for Core Web Vitals metrics
  * Tracks: LCP, FID, CLS, FCP, TTFB
  */
 
 export interface WebVitalsMetric {
   name: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP";
   value: number;
   rating: "good" | "needs-improvement" | "poor";
   delta: number;
   id: string;
 }
 
 type ReportCallback = (metric: WebVitalsMetric) => void;
 
 // Thresholds from web.dev
 const thresholds = {
   LCP: { good: 2500, poor: 4000 },
   FID: { good: 100, poor: 300 },
   CLS: { good: 0.1, poor: 0.25 },
   FCP: { good: 1800, poor: 3000 },
   TTFB: { good: 800, poor: 1800 },
   INP: { good: 200, poor: 500 },
 };
 
 function getRating(name: keyof typeof thresholds, value: number): "good" | "needs-improvement" | "poor" {
   const threshold = thresholds[name];
   if (value <= threshold.good) return "good";
   if (value <= threshold.poor) return "needs-improvement";
   return "poor";
 }
 
 /**
  * Report Web Vitals to console (development) or analytics (production)
  */
 export function reportWebVitals(onReport?: ReportCallback): void {
   if (typeof window === "undefined") return;
 
   // Use Performance Observer API
   try {
     // Largest Contentful Paint
     const lcpObserver = new PerformanceObserver((entryList) => {
       const entries = entryList.getEntries();
       const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
       const value = lastEntry.startTime;
       const metric: WebVitalsMetric = {
         name: "LCP",
         value,
         rating: getRating("LCP", value),
         delta: value,
         id: `lcp-${Date.now()}`,
       };
       onReport?.(metric);
       logMetric(metric);
     });
     lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
 
     // First Input Delay
     const fidObserver = new PerformanceObserver((entryList) => {
       const entries = entryList.getEntries();
       const firstEntry = entries[0] as PerformanceEventTiming;
       if (firstEntry) {
         const value = firstEntry.processingStart - firstEntry.startTime;
         const metric: WebVitalsMetric = {
           name: "FID",
           value,
           rating: getRating("FID", value),
           delta: value,
           id: `fid-${Date.now()}`,
         };
         onReport?.(metric);
         logMetric(metric);
       }
     });
     fidObserver.observe({ type: "first-input", buffered: true });
 
     // Cumulative Layout Shift
     let clsValue = 0;
     const clsObserver = new PerformanceObserver((entryList) => {
       for (const entry of entryList.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
         if (!entry.hadRecentInput) {
           clsValue += entry.value;
         }
       }
     });
     clsObserver.observe({ type: "layout-shift", buffered: true });
 
     // Report CLS on page hide
     document.addEventListener("visibilitychange", () => {
       if (document.visibilityState === "hidden") {
         const metric: WebVitalsMetric = {
           name: "CLS",
           value: clsValue,
           rating: getRating("CLS", clsValue),
           delta: clsValue,
           id: `cls-${Date.now()}`,
         };
         onReport?.(metric);
         logMetric(metric);
       }
     });
 
     // First Contentful Paint
     const fcpObserver = new PerformanceObserver((entryList) => {
       const entries = entryList.getEntries();
       const fcpEntry = entries.find((e) => e.name === "first-contentful-paint");
       if (fcpEntry) {
         const value = fcpEntry.startTime;
         const metric: WebVitalsMetric = {
           name: "FCP",
           value,
           rating: getRating("FCP", value),
           delta: value,
           id: `fcp-${Date.now()}`,
         };
         onReport?.(metric);
         logMetric(metric);
       }
     });
     fcpObserver.observe({ type: "paint", buffered: true });
 
     // Time to First Byte
     const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
     if (navEntry) {
       const value = navEntry.responseStart - navEntry.requestStart;
       const metric: WebVitalsMetric = {
         name: "TTFB",
         value,
         rating: getRating("TTFB", value),
         delta: value,
         id: `ttfb-${Date.now()}`,
       };
       onReport?.(metric);
       logMetric(metric);
     }
   } catch (e) {
     // PerformanceObserver not supported
     console.warn("Web Vitals monitoring not supported:", e);
   }
 }
 
 function logMetric(metric: WebVitalsMetric): void {
   const color = metric.rating === "good" ? "green" : metric.rating === "poor" ? "red" : "orange";
   console.log(
     `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
     `color: ${color}; font-weight: bold;`
   );
 }
 
 /**
  * Performance budget checker
  */
 export function checkPerformanceBudget(): { passed: boolean; violations: string[] } {
   const violations: string[] = [];
   
   // Check bundle size from performance entries
   const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
   const jsResources = resources.filter((r) => r.name.endsWith(".js"));
   const totalJsSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
   
   if (totalJsSize > 200 * 1024) {
     violations.push(`JS bundle size (${(totalJsSize / 1024).toFixed(0)}KB) exceeds 200KB budget`);
   }
 
   return {
     passed: violations.length === 0,
     violations,
   };
 }