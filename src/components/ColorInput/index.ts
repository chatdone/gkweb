import loadable from '@loadable/component';

const CircleColorInput = loadable(() => import('./CircleColorInput'));

export default {
  Circle: CircleColorInput,
};
