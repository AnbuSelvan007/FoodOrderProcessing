import { useState, useEffect } from 'react';

/**
 * Custom hook to check if the window matches a CSS media query.
 *
 * @param query The media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the query matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Initial check
    setMatches(mediaQueryList.matches);

    // Modern browsers use addEventListener
    mediaQueryList.addEventListener('change', documentChangeHandler);

    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler);
    };
  }, [query]);

  return matches;
}
