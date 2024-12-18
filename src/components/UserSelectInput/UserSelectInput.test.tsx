import {
  render,
  screen,
  waitFor,
  userEvent,
  act,
  fixtures,
  fireEvent,
} from '@/test-utils';
import { describe, test, vi } from 'vitest';

import UserSelectInput from './UserSelectInput';

describe('UserSelectInput', () => {
  test('should be able to render', () => {
    render(<UserSelectInput options={[]} />);

    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
  });

  test('should hide the add button when its readonly', () => {
    render(<UserSelectInput options={[]} isReadOnly />);

    expect(screen.queryByTestId('add-btn')).not.toBeInTheDocument();
  });

  test('should show select input and hide the add button when click add button', async () => {
    render(<UserSelectInput options={[]} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    const selectInput = document.querySelector('.arco-select');

    expect(screen.queryByTestId('add-btn')).not.toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();
  });

  test('should show the add button when the select input focus is blur', async () => {
    render(<UserSelectInput options={[]} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    const selectInput = document.querySelector('.arco-select-view') as Element;

    await waitFor(async () => {
      await fireEvent.blur(selectInput);
    });

    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
  });

  test('should show the select input options dropdown', async () => {
    const options = fixtures.generate('selectOption', 2);

    render(<UserSelectInput options={options} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    const selectInput = document.querySelector('.arco-select-view') as Element;

    await waitFor(async () => {
      await fireEvent.click(selectInput);
    });

    options.forEach((option: { label: string }) =>
      screen.getByText(option.label),
    );
  });

  test('should be able select one of options from the select dropdown and show tag of the selected option', async () => {
    const options = fixtures.generate('selectOption', 2);

    render(<UserSelectInput options={options} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    const selectInput = document.querySelector('.arco-select-view') as Element;

    await waitFor(async () => {
      await fireEvent.click(selectInput);

      const option = document.querySelector('.arco-select-option') as Element;

      await fireEvent.click(option);
    });

    expect(screen.getByText(options[0].label)).toBeInTheDocument();
  });

  test('should have callback when selected one of the options from dropdown', async () => {
    const options = fixtures.generate('selectOption', 2);

    const addCallback = vi.fn();

    render(<UserSelectInput options={options} onAdd={addCallback} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    const selectInput = document.querySelector('.arco-select-view') as Element;

    await waitFor(async () => {
      await fireEvent.click(selectInput);

      const option = document.querySelector('.arco-select-option') as Element;

      await fireEvent.click(option);
    });

    expect(addCallback).toHaveBeenCalledTimes(1);
  });

  test('should show tags when value is provided', async () => {
    const options = fixtures.generate('selectOption', 2);

    render(
      <UserSelectInput
        value={options.map((option: { value: string }) => option.value)}
        options={options}
      />,
    );

    options.forEach((option: { label: string }) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('should be able to remove one of the tags', async () => {
    const options = fixtures.generate('selectOption', 2);
    const closeCallback = vi.fn();

    render(<UserSelectInput options={options} onRemove={closeCallback} />);

    const addButton = screen.getByTestId('add-btn');

    await act(async () => {
      await userEvent.click(addButton);
    });

    await waitFor(async () => {
      const selectInput = document.querySelector(
        '.arco-select-view',
      ) as Element;

      await fireEvent.click(selectInput);

      const option = document.querySelector('.arco-select-option') as Element;

      await fireEvent.click(option);
    });

    const label = options[0].label;
    const tag = screen.getByText(label);
    const tagContainer = tag.parentNode as ParentNode;
    const closeButton = tagContainer.querySelector(
      '.arco-tag-close-btn',
    ) as Element;

    expect(closeButton).toBeInTheDocument();

    await waitFor(async () => {
      await fireEvent.click(closeButton);
    });

    expect(closeCallback).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });
});
