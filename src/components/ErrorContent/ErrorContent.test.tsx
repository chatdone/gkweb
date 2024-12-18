import { render, screen, userEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import ErrorContent from './ErrorContent';

import Icons from '@/assets/icons';

const mockLogoutFn = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn().mockImplementation(() => ({
    logout: mockLogoutFn,
  })),
}));

describe('ErrorContent', () => {
  test('should be able to render', () => {
    const title = faker.lorem.words();
    const iconSrc = Icons.clockBreak;

    render(<ErrorContent title={title} iconSrc={iconSrc} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('should show correct image', () => {
    const title = faker.lorem.words();
    const iconSrc = Icons.clockBreak;

    render(<ErrorContent title={title} iconSrc={iconSrc} />);

    const image = screen.getByAltText('no-permission') as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(image.src).toContain(iconSrc);
  });

  test('should have a logout button', async () => {
    const title = faker.lorem.words();
    const iconSrc = Icons.clockBreak;

    render(<ErrorContent title={title} iconSrc={iconSrc} />);

    const logoutButton = screen.getByText(
      new RegExp('Log in to another account', 'i'),
    );

    await userEvent.click(logoutButton);

    expect(mockLogoutFn).toHaveBeenCalled();
    expect(mockLogoutFn).toHaveBeenCalledTimes(1);
    expect(mockLogoutFn).toHaveBeenCalledWith({
      returnTo: `${window.location.origin}/login`,
    });
  });
});
