"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Монтирует детей, только когда обёртка приблизилась к вьюпорту. Для тяжёлых
 * блоков ниже сгиба (карта на посадочной: Leaflet ~42 КБ gzip не должен
 * грузиться ради первого экрана). rootMargin с запасом — к моменту докрутки
 * блок уже смонтирован; плавный scrollIntoView тоже успевает: скролл
 * пересекает границу задолго до цели.
 */
export function LazyMount({
  children,
  rootMargin = "600px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || mounted) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return <div ref={ref}>{mounted ? children : null}</div>;
}
