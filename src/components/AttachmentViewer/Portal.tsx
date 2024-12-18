import { ReactNode, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  wrapperId: string;
  children: ReactNode;
};

const Portal = (props: Props) => {
  const { wrapperId, children } = props;

  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null,
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let newlyCreated = false;

    if (!element) {
      newlyCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }

    setWrapperElement(element);

    return () => {
      if (newlyCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

const createWrapperAndAppendToBody = (wrapperId: string) => {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.append(wrapperElement);

  return wrapperElement;
};

export default Portal;
