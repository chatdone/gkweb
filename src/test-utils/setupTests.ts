import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import tz from 'dayjs/plugin/timezone';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { vi } from 'vitest';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: vi.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
});

URL.createObjectURL = vi.fn();

window.open = vi.fn();
