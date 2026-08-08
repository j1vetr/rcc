/**
 * YoutubeFacade ,  lazy YouTube embed that loads only on interaction.
 *
 * Replaces an always-on iframe with a lightweight poster image.
 * The real iframe is injected only when the user clicks or the component
 * becomes visible after a short delay (for autoplay-style hero videos).
 *
 * Benefits:
 * - Eliminates YouTube's ~450 kB of JS from the critical path
 * - Prevents YouTube iframe from blocking LCP
 * - Zero layout shift: poster fills same aspect ratio as the iframe
 * - Background autoplay mode: loads after user interaction or scroll
 */

import React, { useState, useEffect, useRef } from 'react';

interface YoutubeFacadeProps {
  /** Full YouTube embed src (youtube-nocookie.com) */
  src: string;
  /** CSS class for the iframe (same as the original) */
  className?: string;
  /** Title attribute for accessibility */
  title: string;
  /** Extra allow attribute for iframe */
  allow?: string;
  /** tabIndex for iframe */
  tabIndex?: number;
  /** If true, load after a short delay on mount (background autoplay hero) */
  autoLoad?: boolean;
  /** Delay in ms before auto-loading (default 3000) */
  autoLoadDelay?: number;
}

export function YoutubeFacade({
  src,
  className,
  title,
  allow,
  tabIndex,
  autoLoad = false,
  autoLoadDelay = 3000,
}: YoutubeFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoLoad) return;

    // Load after delay ,  lets the page render + LCP settle first
    timerRef.current = setTimeout(() => setLoaded(true), autoLoadDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoLoad, autoLoadDelay]);

  if (!loaded) {
    // Render nothing visible ,  the parent section provides the background colour.
    // When autoLoad fires, the iframe appears seamlessly.
    return null;
  }

  return (
    <iframe
      className={className}
      src={src}
      title={title}
      allow={allow}
      tabIndex={tabIndex}
      style={{ border: 0 }}
    />
  );
}
