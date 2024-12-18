import { useEffect, useState } from 'react';

type Props = {
  url: string;
  onLoad?: () => void;
  attributes?: Record<string, string>;
};

const useInjectScript = (props: Props) => {
  const { url, onLoad, attributes } = props;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    if (attributes && Object.keys(attributes).length > 0) {
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }

    script.onload = () => {
      onLoad?.();

      setLoaded(true);
    };

    script.onerror = () => {
      setError(true);
    };

    document.body.append(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, onLoad]);

  return { loaded, error };
};

export default useInjectScript;
