import { render, screen, waitFor, userEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test } from 'vitest';

import FormLabel from './FormLabel';

describe('FormLabel', () => {
  test('should be able to render', () => {
    const label = faker.random.words();

    render(<FormLabel label={label} />);

    expect(screen.getByText(new RegExp(label)));
  });

  test('should be able to render tooltip icon', async () => {
    const label = faker.random.words();
    const tooltip = faker.random.words();

    const { container } = render(<FormLabel label={label} tooltip={tooltip} />);

    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  test('should be able to show tooltip content', async () => {
    const label = faker.random.words();
    const tooltip = faker.random.words();

    const { container } = render(<FormLabel label={label} tooltip={tooltip} />);

    const icon = container.querySelector('svg') as SVGSVGElement;

    await userEvent.hover(icon);

    await waitFor(() => {
      expect(screen.getByText(tooltip));
    });
  });
});
