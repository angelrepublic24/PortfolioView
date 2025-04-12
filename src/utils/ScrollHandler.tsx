'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { scroller } from 'react-scroll';

export default function ScrollHandler() {
  const searchParams = useSearchParams();
  const scrollTo = searchParams.get('scrollTo');

  useEffect(() => {
    if (scrollTo) {
      scroller.scrollTo(scrollTo, {
        smooth: true,
        duration: 500,
        offset: -100,
      });
    }
  }, [scrollTo]);

  return null;
}
