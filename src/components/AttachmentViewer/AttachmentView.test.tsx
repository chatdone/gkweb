import {
  render,
  screen,
  fireEvent,
  mockFile,
  act,
  waitFor,
  fixtures,
} from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import AttachmentViewer from './AttachmentViewer';

describe('AttachmentViewer', () => {
  test('should be able to render', async () => {
    const fileName = faker.system.commonFileName();

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
      expect(screen.getByText(/no preview available/i)).toBeInTheDocument();
    });
  });

  test('should be able to close', async () => {
    const fileName = faker.system.commonFileName();
    const closeCallback = vi.fn();

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={closeCallback}
          fileName={fileName}
        />,
      );
    });

    const closeButton = screen.getByTestId('close-button');

    await fireEvent.click(closeButton);

    expect(closeCallback).toHaveBeenCalledTimes(1);
  });

  test('should be able to download', async () => {
    const fileName = faker.system.commonFileName();
    const downloadCallback = vi.fn();

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          onDownload={downloadCallback}
        />,
      );
    });

    const downloadButton = screen.getByTestId('download-button');

    await fireEvent.click(downloadButton);

    expect(downloadCallback).toHaveBeenCalledTimes(1);
  });

  test('should be able to show the user info', async () => {
    const fileName = faker.system.commonFileName();
    const user = fixtures.generate('user');

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          createdBy={user}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(new RegExp(user.name)));
      expect(
        screen
          .getAllByRole('img')
          .some(
            (image) => (image as HTMLImageElement).src === user.profileImage,
          ),
      ).toBeTruthy();
    });
  });

  test('should be able to show file created date', async () => {
    const fileName = faker.system.commonFileName();
    const date = '2022-09-16';

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          createdAt={date}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(new RegExp('16 Sep 2022')));
    });
  });

  test('should be able to preview image', async () => {
    const fileName = faker.system.commonFileName('jpg');
    const user = fixtures.generate('user');
    const file = mockFile({
      fileName,
      mimeType: 'image/jpg',
      size: faker.datatype.number(4),
    });

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          createdBy={user}
          getAttachment={vi.fn().mockResolvedValue(file)}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
    });
  });

  test('should be able to preview video', async () => {
    const fileName = faker.system.commonFileName('mp4');
    const file = mockFile({
      fileName,
      mimeType: 'video/mp4',
      size: faker.datatype.number(4),
    });

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          getAttachment={vi.fn().mockResolvedValue(file)}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('video-container')).toBeInTheDocument();
    });
  });

  test('should be able to preview pdf', async () => {
    const fileName = faker.system.commonFileName('pdf');
    const file = mockFile({
      fileName,
      mimeType: 'application/pdf',
      size: faker.datatype.number(4),
    });

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          getAttachment={vi.fn().mockResolvedValue(file)}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    });
  });

  test('should show no preview available if file not supported', async () => {
    const fileName = faker.system.commonFileName('csv');
    const file = mockFile({
      fileName,
      mimeType: 'application/csv',
      size: faker.datatype.number(4),
    });

    await act(async () => {
      await render(
        <AttachmentViewer
          visible={true}
          onCancel={vi.fn}
          fileName={fileName}
          getAttachment={vi.fn().mockResolvedValue(file)}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/no preview available/i)).toBeInTheDocument();
    });
  });
});

describe('AttachmentViewer.view', () => {
  test('should be able to render', async () => {
    const fileName = faker.system.commonFileName();

    await act(async () => {
      AttachmentViewer.view({
        fileName,
      });
    });

    await waitFor(() => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
      expect(screen.getByText(/no preview available/i)).toBeInTheDocument();
    });
  });
});
