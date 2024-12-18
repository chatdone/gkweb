import dayjs from 'dayjs';
import { range } from 'lodash-es';

import i18n from '@/i18n';

const CALENDAR_FORMAT = {
  lastDay: '[Yesterday at] h:mm A',
  lastWeek: '[Last] dddd [at] h:mm A',
  sameDay: '[Today at] h:mm A',
  nextDay: '[Tomorrow at] h:mm A',
  nextWeek: 'dddd [at] h:mm A',
  sameElse: 'DD/MM/YYYY',
};

const notificationCalendarFormat = {
  lastWeek:
    i18n.language === 'zh'
      ? `YY[${i18n.t('calendar.year')}] MMM DD[${i18n.t(
          'calendar.day',
        )}], A hh:mm`
      : 'DD MMMM YYYY [at] hh:mm A',
  lastDay:
    i18n.language === 'zh'
      ? `[${i18n.t('calendar.yesterday')}], Ahh:mm`
      : `[${i18n.t('calendar.yesterday')}], hh:mm A`,
  sameDay:
    i18n.language === 'zh'
      ? `[${i18n.t('calendar.today')}], Ahh:mm`
      : `[${i18n.t('calendar.today')}], hh:mm A`,
  nextDay: `[${i18n.t('calendar.tomorrow')}]`,
  nextWeek:
    i18n.language === 'zh'
      ? `YY[${i18n.t('calendar.year')}] MMM DD[${i18n.t(
          'calendar.day',
        )}], A hh:mm`
      : 'DD MMMM YYYY [at] hh:mm A',
  sameElse:
    i18n.language === 'zh'
      ? `YY[${i18n.t('calendar.year')}] MMM DD[${i18n.t(
          'calendar.day',
        )}], A hh:mm`
      : 'DD MMMM YYYY [at] hh:mm A',
};

const DATE_LIST = range(1, 29).map((x) => ({
  label: dayjs().set('date', x).format('Do'),
  value: x,
}));

const MONTH_LIST = range(0, 12).map((x) => ({
  label: dayjs().month(x).format('MMMM'),
  value: x + 1,
}));

export { CALENDAR_FORMAT, notificationCalendarFormat, DATE_LIST, MONTH_LIST };
