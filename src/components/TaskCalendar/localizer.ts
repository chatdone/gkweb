// @ts-nocheck
import dayjs from 'dayjs';
import { DateLocalizer } from 'react-big-calendar';

const weekRangeFormat = ({ start, end }: any, culture: any, local: any) =>
  local.format(start, 'MMMM DD', culture) +
  ' – ' +
  // updated to use this localizer 'eq()' method
  local.format(end, local.eq(start, end, 'month') ? 'DD' : 'MMMM DD', culture);

const dateRangeFormat = ({ start, end }: any, culture: any, local: any) =>
  local.format(start, 'L', culture) + ' – ' + local.format(end, 'L', culture);

const timeRangeFormat = ({ start, end }: any, culture: any, local: any) =>
  local.format(start, 'LT', culture) + ' – ' + local.format(end, 'LT', culture);

const timeRangeStartFormat = ({ start }: any, culture: any, local: any) =>
  local.format(start, 'LT', culture) + ' – ';

const timeRangeEndFormat = ({ end }: any, culture: any, local: any) =>
  ' – ' + local.format(end, 'LT', culture);

export const formats = {
  dateFormat: 'DD',
  dayFormat: 'DD ddd',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 'LT',

  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd MMM DD',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM DD',
  agendaTimeFormat: 'LT',
  agendaTimeRangeFormat: timeRangeFormat,
};

const fixUnit = (unit: string | undefined): any => {
  let datePart = unit ? unit.toLowerCase() : unit;
  if (datePart === 'FullYear') {
    datePart = 'year';
  } else if (!datePart) {
    datePart = undefined;
  }
  return datePart;
};

const dayjsLocalizer = () => {
  const locale = (m: any, c: any) => (c ? m.locale(c) : m);

  const defineComparators = (a: any, b: any, unit: any) => {
    const datePart = fixUnit(unit);
    const dtA = datePart ? dayjs(a).startOf(datePart) : dayjs(a);
    const dtB = datePart ? dayjs(b).startOf(datePart) : dayjs(b);
    return [dtA, dtB, datePart];
  };

  const startOf = (date = null, unit: any) => {
    const datePart = fixUnit(unit);
    if (datePart) {
      return dayjs(date).startOf(datePart).toDate();
    }
    return dayjs(date).toDate();
  };

  const endOf = (date = null, unit: any) => {
    const datePart = fixUnit(unit);
    if (datePart) {
      return dayjs(date).endOf(datePart).toDate();
    }
    return dayjs(date).toDate();
  };

  const eq = (a: any, b: any, unit?: any) => {
    const [dtA, dtB, datePart] = defineComparators(a, b, unit);
    return dtA.isSame(dtB, datePart);
  };

  const neq = (a: any, b: any, unit: any) => {
    return !eq(a, b, unit);
  };

  const gt = (a: any, b: any, unit: any) => {
    const [dtA, dtB, datePart] = defineComparators(a, b, unit);
    return dtA.isAfter(dtB, datePart);
  };

  const lt = (a: any, b: any, unit: any) => {
    const [dtA, dtB, datePart] = defineComparators(a, b, unit);
    return dtA.isBefore(dtB, datePart);
  };

  const gte = (a: any, b: any, unit: any) => {
    const [dtA, dtB, datePart] = defineComparators(a, b, unit);
    return dtA.isSameOrBefore(dtB, datePart);
  };

  const lte = (a: any, b: any, unit?: any) => {
    const [dtA, dtB, datePart] = defineComparators(a, b, unit);
    return dtA.isSameOrBefore(dtB, datePart);
  };

  const inRange = (day: any, min: any, max: any, unit = 'day') => {
    const datePart = fixUnit(unit);
    const mDay = dayjs(day);
    const mMin = dayjs(min);
    const mMax = dayjs(max);
    return mDay.isBetween(mMin, mMax, datePart, '[]');
  };

  const min = (dateA: any, dateB: any) => {
    const dtA = dayjs(dateA);
    const dtB = dayjs(dateB);
    const minDt = dayjs.min(dtA, dtB);
    return minDt.toDate();
  };

  const max = (dateA: any, dateB: any) => {
    const dtA = dayjs(dateA);
    const dtB = dayjs(dateB);
    const maxDt = dayjs.max(dtA, dtB);
    return maxDt.toDate();
  };

  const merge = (date: any, time: any) => {
    if (!date && !time) return null;

    const tm = dayjs(time).format('HH:mm:ss');
    const dt = dayjs(date).startOf('day').format('MM/DD/YYYY');
    // We do it this way to avoid issues when timezone switching
    return dayjs(`${dt} ${tm}`, 'MM/DD/YYYY HH:mm:ss').toDate();
  };

  const add = (date: any, adder: any, unit: any) => {
    const datePart = fixUnit(unit);
    return dayjs(date).add(adder, datePart).toDate();
  };

  const range = (start: any, end: any, unit = 'day') => {
    const datePart = fixUnit(unit);
    // because the add method will put these in tz, we have to start that way
    let current = dayjs(start).toDate();
    const days = [];

    while (lte(current, end)) {
      days.push(current);
      current = add(current, 1, datePart);
    }

    return days;
  };

  const ceil = (date: any, unit: any) => {
    const datePart = fixUnit(unit);
    const floor = startOf(date, datePart);

    return eq(floor, date) ? floor : add(floor, 1, datePart);
  };

  const diff = (a: any, b: any, unit = 'day') => {
    const datePart = fixUnit(unit);
    // don't use 'defineComparators' here, as we don't want to mutate the values
    const dtA = dayjs(a);
    const dtB = dayjs(b);
    return dtB.diff(dtA, datePart);
  };

  const minutes = (date: any) => {
    const dt = dayjs(date);
    return dt.minute();
  };

  const firstOfWeek = (culture: any) => {
    const data = dayjs.localeData();
    return data ? data.firstDayOfWeek() : 0;
  };

  const firstVisibleDay = (date: any) => {
    return dayjs(date).startOf('month').startOf('week').toDate();
  };

  const lastVisibleDay = (date: any) => {
    return dayjs(date).endOf('month').endOf('week').toDate();
  };

  const visibleDays = (date: any) => {
    let current = firstVisibleDay(date);
    const last = lastVisibleDay(date);
    const days = [];

    while (lte(current, last)) {
      days.push(current);
      current = add(current, 1, 'd');
    }

    return days;
  };

  const getSlotDate = (dt: any, minutesFromMidnight: any, offset: any) => {
    return dayjs(dt)
      .startOf('day')
      .minute(minutesFromMidnight + offset)
      .toDate();
  };

  // moment will automatically handle DST differences in it's calculations
  const getTotalMin = (start: any, end: any) => {
    return diff(start, end, 'minutes');
  };

  const getMinutesFromMidnight = (start: any) => {
    const dayStart = dayjs(start).startOf('day');
    const day = dayjs(start);
    return day.diff(dayStart, 'minutes');
  };

  // These two are used by DateSlotMetrics
  const continuesPrior = (start: any, first: any) => {
    const mStart = dayjs(start);
    const mFirst = dayjs(first);
    return mStart.isBefore(mFirst, 'day');
  };

  const continuesAfter = (start: any, end: any, last: any) => {
    const mEnd = dayjs(end);
    const mLast = dayjs(last);
    return mEnd.isSameOrAfter(mLast, 'minutes');
  };

  // These two are used by eventLevels
  const sortEvents = ({
    evtA: { start: aStart, end: aEnd, allDay: aAllDay },
    evtB: { start: bStart, end: bEnd, allDay: bAllDay },
  }: any) => {
    const startSort = +startOf(aStart, 'day') - +startOf(bStart, 'day');

    const durA = diff(aStart, ceil(aEnd, 'day'), 'day');

    const durB = diff(bStart, ceil(bEnd, 'day'), 'day');

    return (
      startSort || // sort by start Day first
      Math.max(durB, 1) - Math.max(durA, 1) || // events spanning multiple days go first
      !!bAllDay - !!aAllDay || // then allDay single day events
      +aStart - +bStart || // then sort by start time *don't need moment conversion here
      +aEnd - +bEnd // then sort by end time *don't need moment conversion here either
    );
  };

  const inEventRange = ({
    event: { start, end },
    range: { start: rangeStart, end: rangeEnd },
  }: any) => {
    const startOfDay = dayjs(start).startOf('day');
    const eEnd = dayjs(end);
    const rStart = dayjs(rangeStart);
    const rEnd = dayjs(rangeEnd);

    const startsBeforeEnd = startOfDay.isSameOrBefore(rEnd, 'day');
    // when the event is zero duration we need to handle a bit differently
    const sameMin = !startOfDay.isSame(eEnd, 'minutes');
    const endsAfterStart = sameMin
      ? eEnd.isAfter(rStart, 'minutes')
      : eEnd.isSameOrAfter(rStart, 'minutes');

    return startsBeforeEnd && endsAfterStart;
  };

  // moment treats 'day' and 'date' equality very different
  // moment(date1).isSame(date2, 'day') would test that they were both the same day of the week
  // moment(date1).isSame(date2, 'date') would test that they were both the same date of the month of the year
  const isSameDate = (date1: any, date2: any) => {
    const dt = dayjs(date1);
    const dt2 = dayjs(date2);
    return dt.isSame(dt2, 'date');
  };

  /**
   * This method, called once in the localizer constructor, is used by eventLevels
   * 'eventSegments()' to assist in determining the 'span' of the event in the display,
   * specifically when using a timezone that is greater than the browser native timezone.
   * @returns number
   */
  const browserTZOffset = () => {
    /**
     * Date.prototype.getTimezoneOffset horrifically flips the positive/negative from
     * what you see in it's string, so we have to jump through some hoops to get a value
     * we can actually compare.
     */
    const dt = new Date();
    const neg = /-/.test(dt.toString()) ? '-' : '';
    const dtOffset = dt.getTimezoneOffset();
    const comparator = Number(`${neg}${Math.abs(dtOffset)}`);
    // moment correctly provides positive/negative offset, as expected
    const mtOffset = dayjs().utcOffset();
    return mtOffset > comparator ? 1 : 0;
  };

  return new DateLocalizer({
    formats,

    firstOfWeek,
    firstVisibleDay,
    lastVisibleDay,
    visibleDays,

    format(value, format, culture) {
      return locale(dayjs(value), culture).format(format);
    },

    lt,
    lte,
    gt,
    gte,
    eq,
    neq,
    merge,
    inRange,
    startOf,
    endOf,
    range,
    add,
    diff,
    ceil,
    min,
    max,
    minutes,

    getSlotDate,
    getTotalMin,
    getMinutesFromMidnight,
    continuesPrior,
    continuesAfter,
    sortEvents,
    inEventRange,
    isSameDate,
    browserTZOffset,
  });
};

export { dayjsLocalizer };
