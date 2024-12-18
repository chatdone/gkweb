// @ts-nocheck
import { render } from '@testing-library/react';

import fixtures from './fixtures';

const customRender = (ui, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed

    wrapper: ({ children }) => children,

    ...options,
  });

const mockFile = ({
  fileName,
  size,
  mimeType,
}: {
  fileName: string;
  size: number;
  mimeType: string;
}) => {
  const range = (count: number) => {
    let output = '';
    for (let i = 0; i < count; i++) {
      output += 'a';
    }
    return output;
  };

  const blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = fileName;

  return blob;
};

export * from '@testing-library/react';

/* c8 ignore next */
export { default as userEvent } from '@testing-library/user-event';

// override render export

export { customRender as render, mockFile, fixtures };
