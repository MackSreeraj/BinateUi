'use client';

import { useEffect, useState, ReactNode } from 'react';

export function FontErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If the font hasn't loaded after 3 seconds, we'll use the fallback
    const timer = setTimeout(() => {
      const isFontLoaded = document.fonts.check('1rem Inter');
      if (!isFontLoaded) {
        console.warn('Font loading took too long, using fallback font');
        setHasError(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={hasError ? 'font-sans' : ''}>
      {children}
    </div>
  );
}
