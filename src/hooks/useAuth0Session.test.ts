import { afterEach, describe, test, vi } from 'vitest';
import Cookies from 'js-cookie';
import MockDate from 'mockdate';

import Configs from '@/configs';
import useAuth0Session from './useAuth0Session';

const { SESSION_COOKIE_KEY } = Configs.session;

describe('useAuth0Session', () => {
  const validToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InFIVFFmNlV2akVTMEk3LXQ5czVYVSJ9.eyJodHRwczovL2FwaS5nb2t1ZG9zLmlvL3JvbGVzIjpbIkFkbWluUGFuZWxVc2VyIl0sIm5pY2tuYW1lIjoiZW5vY2giLCJuYW1lIjoiZW5vY2hANmJpei5haSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80NDdiZjFkMTk1MmQxMmQ0Njc2M2I3MzhiODIyYmMwND9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmVuLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIyLTA1LTExVDA5OjA2OjMyLjE3M1oiLCJlbWFpbCI6ImVub2NoQDZiaXouYWkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmdva3Vkb3MuaW8vIiwic3ViIjoiYXV0aDB8NjE4YTZjNGUyYzA2YmEwMDZiYzU0N2MzIiwiYXVkIjoiVVp6MDRWdzk3emc2QjBBNnZQY1VSR0ZUbkc2bW5XaFEiLCJpYXQiOjE2NTIzMjkyODIsImV4cCI6MTY1MjY4OTI4MCwibm9uY2UiOiJPVWxsYlVSNVpGa3VkV1ZQVFVodmFXcGljVWxrYlRCaGFsWmtZa1pTYzBsemN5NHlNMlUyWjNnMll3PT0ifQ.RAz5ltNcZs8rHhAnUBhS8wdOGKg2mczwbbL1eDMv0CeP1-3syB_vqiKO5uXmzMgp3ztsTia690vZIllbn7Am-Euu-FaeiO8E_TPwnvLT-GwRiB3dr5R5sUom9ijfSucg0hDeKmyr7OGIn_QRQF9D6w8zeyKY4KJWha7-dnbNo_R53Y7WVKt1KyKw1T6ynFTHzuuRUwJQpcVoC3oiYuoen023-fSZ-e44CMUIaGH3ihKRRrK6Qou92dPJazGf1vLtKE6z7b4yNo_AJASS3ScANXb_fZuM3OtR1juN0ZKCoD0sobV3OnMsIVgNuINmrfdQF5NabS_BmzZe86MoLMAFCg';
  afterEach(() => {
    vi.restoreAllMocks();
    MockDate.reset();
  });

  describe('getSession', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('it should return the session data if present', () => {
      const { getSession } = useAuth0Session();

      const mockResult = {
        token: validToken,
        user: {
          name: 'Shirakami Fubuki',
        },
      };
      Cookies.get = vi.fn().mockReturnValue(JSON.stringify(mockResult));
      Cookies.remove = vi.fn().mockImplementation(() => vi.fn());

      const res = getSession();

      expect(Cookies.get).toHaveBeenCalledWith(SESSION_COOKIE_KEY);
      expect(res).toEqual(mockResult);
    });

    test('it should return null on error', () => {
      const { getSession } = useAuth0Session();
      Cookies.get = vi.fn().mockImplementation(() => {
        throw new Error();
      });

      const res = getSession();

      expect(res).toBeNull();
    });
  });

  describe('storeSession', () => {
    test('it should store the contents in the cookie', () => {
      const mockInput = {
        token: 'abcd1234',
        user: {
          name: 'Shirakami Fubuki',
        },
      };
      Cookies.set = vi.fn();

      const { setSession } = useAuth0Session();
      setSession(mockInput);

      expect(Cookies.set).toHaveBeenCalledWith(
        SESSION_COOKIE_KEY,
        JSON.stringify(mockInput),
      );
    });
  });
});
