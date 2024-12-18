import useInjectScript from '@/hooks/useInjectScript';

import Configs from '@/configs';

const HubSpot = () => {
  Configs.GK_ENVIRONMENT !== 'development' &&
    useInjectScript({
      url: '//js.hs-scripts.com/8768807.js',
    });

  return <></>;
};

export default HubSpot;
