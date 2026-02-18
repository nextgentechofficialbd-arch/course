
'use client';

import { useEffect } from 'react';

export default function IPTracker({ page }: { page: string }) {
  useEffect(() => {
    const track = async () => {
      try {
        await fetch('/api/track-ip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page }),
        });
      } catch (e) {
        console.error('IP tracking failed', e);
      }
    };
    track();
  }, [page]);

  return null;
}
