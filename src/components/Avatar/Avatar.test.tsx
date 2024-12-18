import { render, screen, waitFor, userEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test } from 'vitest';

import Avatar, { getNameInitials } from './Avatar';

describe('getNameInitials', () => {
  test('should return the correct name initials', () => {
    const name = 'Nicole Rosenbaum';

    const result = getNameInitials(name);

    expect(result).toBe('NR');
  });

  test('should filter out special characters', () => {
    const name = 'Noris & Partners';

    const result = getNameInitials(name);

    expect(result).toBe('NP');
  });
});

describe('Avatar', () => {
  test('should be able to render', () => {
    render(<Avatar />);
  });

  test('should be able to display the name correctly', () => {
    const name = faker.name.findName();
    const displayName = getNameInitials(name);

    render(<Avatar name={name} />);

    expect(screen.getByText(new RegExp(displayName, 'i'))).toBeInTheDocument();
  });

  test('should be able to display image', () => {
    const imageUrl = faker.image.imageUrl();

    render(<Avatar imageSrc={imageUrl} />);

    const imgElement = screen.getByRole('img') as HTMLImageElement;

    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe(imageUrl);
  });

  test('should be able to add image class name', () => {
    const imageUrl = faker.image.imageUrl();
    const className = faker.random.word();

    render(<Avatar imageClassName={className} imageSrc={imageUrl} />);

    const imgElement = screen.getByRole('img') as HTMLImageElement;

    expect(imgElement).toBeInTheDocument();
    expect(imgElement.className).toContain(className);
  });

  test('should be able to show tooltip', async () => {
    const name = faker.name.findName();
    const displayName = getNameInitials(name);

    render(<Avatar name={name} showTooltip />);

    const component = screen.getByText(new RegExp(displayName, 'i'));

    await userEvent.hover(component);

    await waitFor(() => {
      expect(screen.getByText(name));
    });
  });
});
