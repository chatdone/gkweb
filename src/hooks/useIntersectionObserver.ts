import { useState, RefObject, useEffect } from 'react';

type Props = {
  elementRef: RefObject<Element>;
  observerConfig?: IntersectionObserverInit;
};

const useIntersectionObserver = (props: Props) => {
  const { elementRef, observerConfig } = props;

  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    }, observerConfig);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, observerConfig]);

  return isIntersecting;
};

export default useIntersectionObserver;
