import { render, screen, waitFor, userEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test } from 'vitest';

import TooltipIcon from './TooltipIcon';

describe('TooltipIcon', () => {
  test('should be able to render', () => {
    render(<TooltipIcon />);

    const icon = document.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  test('should show tooltip', async () => {
    const tooltip = faker.lorem.sentence();

    render(<TooltipIcon content={tooltip} />);

    const icon = document.querySelector('svg') as SVGSVGElement;

    await userEvent.hover(icon);

    await waitFor(() => {
      expect(screen.getByText(tooltip)).toBeInTheDocument();
    });
  });
});
