import { render, screen } from '@/test-utils';
import { describe, test } from 'vitest';

import EmptyNotification from './EmptyNotification';

import Icons from '@/assets/icons';

describe('EmptyNotification', () => {
  test('should be able to render', () => {
    render(<EmptyNotification />);

    expect(
      screen.getByText(new RegExp("You don't have any notifications", 'i')),
    ).toBeInTheDocument();
  });

  test('should display the correct image', () => {
    render(<EmptyNotification />);

    const image = screen.getByAltText(
      'empty notifications',
    ) as HTMLImageElement;

    expect(image.src).toContain(Icons.emptyNotifications);
  });
});
