import { render, screen, fireEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test } from 'vitest';

import ImageViewer from './ImageViewer';

describe('ImageViewer', () => {
  test('should be able to render', () => {
    const url = faker.image.imageUrl();

    render(<ImageViewer url={url} />);

    const image = screen.getByRole('img') as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(image.src).toBe(url);
  });

  test('should be zoom in image', async () => {
    const url = faker.image.imageUrl();

    render(<ImageViewer url={url} />);

    const imageContainer = screen.getByTestId('image-container');

    const currentScaleValue = imageContainer.style.transform.match(
      /\d/,
    )?.[0] as string;

    const zoomInButton = screen.getByTestId('zoom-in');

    expect(currentScaleValue).toBeDefined();
    expect(zoomInButton).toBeInTheDocument();

    await fireEvent.click(zoomInButton);

    const updatedContainer = screen.getByTestId('image-container');

    const newScaleValue = updatedContainer.style.transform.match(
      /\d+(\.(\d*)?)/,
    )?.[0] as string;

    expect(+newScaleValue).toBeGreaterThan(+currentScaleValue);
  });

  test('should be zoom out image', async () => {
    const url = faker.image.imageUrl();

    render(<ImageViewer url={url} />);

    const imageContainer = screen.getByTestId('image-container');

    const currentScaleValue = imageContainer.style.transform.match(
      /\d/,
    )?.[0] as string;

    const zoomOutButton = screen.getByTestId('zoom-out');

    expect(currentScaleValue).toBeDefined();
    expect(zoomOutButton).toBeInTheDocument();

    await fireEvent.click(zoomOutButton);

    const updatedContainer = screen.getByTestId('image-container');

    const newScaleValue = updatedContainer.style.transform.match(
      /\d+(\.(\d*)?)/,
    )?.[0] as string;

    expect(+newScaleValue).toBeLessThan(+currentScaleValue);
  });

  test('should have maximum zoom level', async () => {
    const url = faker.image.imageUrl();

    render(<ImageViewer url={url} />);

    const zoomInButton = screen.getByTestId('zoom-in');

    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);
    await fireEvent.click(zoomInButton);

    const updatedContainer = screen.getByTestId('image-container');

    const scaleValue = updatedContainer.style.transform.match(
      /\d+(\.(\d*)?)/,
    )?.[0] as string;

    expect(+scaleValue).toBe(2.5);
  });

  test('should have minimum zoom level', async () => {
    const url = faker.image.imageUrl();

    render(<ImageViewer url={url} />);

    const zoomOutButton = screen.getByTestId('zoom-out');

    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);
    await fireEvent.click(zoomOutButton);

    const updatedContainer = screen.getByTestId('image-container');

    const scaleValue = updatedContainer.style.transform.match(
      /\d+(\.(\d*)?)/,
    )?.[0] as string;

    expect(+scaleValue).toBe(0.25);
  });
});
