import { render, screen } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test } from 'vitest';

import EmptyContent from './EmptyContent';

describe('EmptyContent', () => {
  test('should be able to render', () => {
    const title = faker.random.words();
    const subtitle = faker.lorem.sentence();
    const iconSrc = faker.image.imageUrl();

    render(
      <EmptyContent title={title} subtitle={subtitle} iconSrc={iconSrc} />,
    );

    const image = document.querySelector('img');

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(image?.src).toBe(iconSrc);
  });

  test('should be able to hide the image', () => {
    const title = faker.random.words();
    const subtitle = faker.lorem.sentence();
    const iconSrc = faker.image.imageUrl();

    render(
      <EmptyContent
        title={title}
        subtitle={subtitle}
        iconSrc={iconSrc}
        showImage={false}
      />,
    );

    const image = document.querySelector('img');

    expect(image).not.toBeInTheDocument();
  });

  test('should be able to hide the info icon', () => {
    const title = faker.random.words();
    const subtitle = faker.lorem.sentence();
    const iconSrc = faker.image.imageUrl();

    render(
      <EmptyContent
        title={title}
        subtitle={subtitle}
        iconSrc={iconSrc}
        showInfoIcon={false}
      />,
    );

    const icon = document.querySelector('svg');

    expect(icon).not.toBeInTheDocument();
  });
});
