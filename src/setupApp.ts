//import * as Sentry from '@sentry/react';
import '@arco-design/web-react/dist/css/arco.css';
//import { BrowserTracing } from '@sentry/tracing';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ReactGA from 'react-ga4';

import Configs from './configs';
import './index.less';
import './locale';

dayjs.extend(calendar);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localeData);
dayjs.extend(minMax);
dayjs.extend(tz);
dayjs.extend(weekday);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);

// Sentry.init({
//   dsn: Configs.env.SENTRY_DSN,
//   environment: Configs.GK_ENVIRONMENT,
//   integrations: [new BrowserTracing()],
// });

// ReactGA.initialize(Configs.env.GA_MEASUREMENT_ID, {
//   testMode: !(Configs.GK_ENVIRONMENT === 'production'),
// });

NProgress.configure({
  minimum: 0.4,
  showSpinner: false,
});
