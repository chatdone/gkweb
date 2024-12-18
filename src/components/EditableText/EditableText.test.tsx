import { render, screen, userEvent, fireEvent } from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import EditableText from './EditableText';

describe('EditableText', () => {
  test('should be able to render', () => {
    const text = faker.lorem.sentence();

    render(<EditableText value={text} onSave={vi.fn()} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('should be edit the text', async () => {
    const text = faker.lorem.sentence();

    render(<EditableText value={text} onSave={vi.fn()} />);

    const displayText = screen.getByText(text);

    await userEvent.click(displayText);

    const textArea = document.querySelector('textarea');

    expect(textArea).toBeInTheDocument();
  });

  test('should show save and cancel buttons when editing text', async () => {
    const text = faker.lorem.sentence();

    render(<EditableText value={text} onSave={vi.fn()} />);

    const displayText = screen.getByText(text);

    await userEvent.click(displayText);

    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  test('should return updated value when click the save button', async () => {
    const text = faker.lorem.sentence();
    const newText = faker.lorem.sentence();

    let result = '';

    render(
      <EditableText
        value={text}
        onSave={(value) => {
          result = value;
        }}
      />,
    );

    const displayText = screen.getByText(text);

    await userEvent.click(displayText);

    const textArea = screen.getByText(text);

    fireEvent.change(textArea, { target: { value: newText } });

    expect(screen.getByText(newText)).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);

    await userEvent.click(saveButton);

    expect(result).toBe(newText);
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
  });

  test('should revert to initial value when click cancel button', async () => {
    const text = faker.lorem.sentence();
    const newText = faker.lorem.sentence();

    render(<EditableText value={text} onSave={vi.fn()} />);

    const displayText = screen.getByText(text);

    await userEvent.click(displayText);

    const textArea = screen.getByText(text);

    fireEvent.change(textArea, { target: { value: newText } });

    expect(screen.getByText(newText)).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);

    await userEvent.click(cancelButton);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
  });
});
