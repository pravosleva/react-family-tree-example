/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL

export const LazyImage = (props: any) => {
  const [inView, setInView] = useState(false);

  const placeholderRef = useRef();

  function onIntersection(entries: any[], _opts: any) {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      root: null, // default is the viewport
      threshold: 0.5, // percentage of target's visible area. Triggers "onIntersection"
    });

    if (placeholderRef?.current) {
      observer.observe(placeholderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return inView ? (
    <img {...props} alt={props.alt || ""} />
  ) : (
    <img
      {...props}
      ref={placeholderRef}
      src={`${PUBLIC_URL}/img/loader7.svg`}
      alt={props.alt || ""}
    />
  );
};
