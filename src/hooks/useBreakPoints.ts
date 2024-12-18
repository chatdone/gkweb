import useMediaQuery from './useMediaQuery';

/** refer to https://tailwindcss.com/docs/responsive-design */
const useBreakPoints = () => {
  const [isSm, isMd, isLg, isXl, is2Xl] = useMediaQuery({
    query: [
      '(min-width: 640px)',
      '(min-width: 768px)',
      '(min-width: 1024px)',
      '(min-width: 1280px)',
      '(min-width: 1536px)',
    ],
  });

  return { isSm, isMd, isLg, isXl, is2Xl };
};

export default useBreakPoints;
