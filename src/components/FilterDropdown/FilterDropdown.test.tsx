import {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  fixtures,
} from '@/test-utils';
import faker from '@faker-js/faker';
import { describe, test, vi } from 'vitest';

import FilterDropdown from './FilterDropdown';

describe('FilterDropdown', () => {
  test('should be able to render', () => {
    render(<FilterDropdown fields={[]} value={vi.fn} onUpdate={vi.fn} />);

    const filterButton = screen.getByRole('button');

    expect(filterButton).toBeInTheDocument();
  });

  test('should open popup menu when click the button', async () => {
    render(<FilterDropdown fields={[]} value={vi.fn} onUpdate={vi.fn()} />);

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(() => {
      screen.getByText('Apply Filters');
    });
  });

  test('should have text input type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'input',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(() => {
      screen.getByText(fieldLabel);
    });

    const input = document.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  test('should update the value when click apply and close the popup', async () => {
    const fieldLabel = faker.random.word();
    const updateValue = faker.random.word();

    let value = {
      test: '',
    };

    render(
      <FilterDropdown
        fields={[
          {
            type: 'input',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={value}
        onUpdate={(newValue) => {
          value = newValue;
        }}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      const input = document.querySelector('input') as HTMLInputElement;
      const applyButton = screen.getByText(/apply filter/i);

      fireEvent.change(input, {
        target: { value: updateValue },
      });

      await userEvent.click(applyButton);
    });

    await waitFor(() => {
      expect(screen.queryByText(/apply filter/i)).not.toBeInTheDocument();
    });

    expect(value).toStrictEqual({
      test: updateValue,
    });
  });

  test('should have select type option', async () => {
    const fieldLabel = faker.random.word();
    const placeholder = faker.random.words();
    const options = [
      {
        label: faker.random.words(),
        value: faker.datatype.uuid(),
      },
      {
        label: faker.random.words(),
        value: faker.datatype.uuid(),
      },
    ];

    render(
      <FilterDropdown
        fields={[
          {
            type: 'select',
            field: 'test',
            label: fieldLabel,
            options,
            placeholder,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      const label = screen.getByText(fieldLabel);

      expect(label).toBeInTheDocument();
    });

    await waitFor(async () => {
      const select = screen.getByRole('combobox');

      await userEvent.click(select);
    });

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('should have checkbox type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'checkbox',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(() => {
      const label = screen.getByText(fieldLabel);

      expect(label).toBeInTheDocument();
    });

    await waitFor(async () => {
      const checkbox = document.body.querySelector('.arco-checkbox') as Element;

      expect(checkbox).toBeInTheDocument();

      await userEvent.click(checkbox);
    });

    const checkbox = document.body.querySelector('.arco-checkbox') as Element;
    expect(checkbox.className).toContain('checked');
  });

  test('should have number input type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'number',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(() => {
      screen.getByText(fieldLabel);
    });

    const input = document.querySelector('.arco-input-number');
    expect(input).toBeInTheDocument();
  });

  test('should have min max value input type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'minMax',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: {},
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(() => {
      screen.getByText(fieldLabel);
      screen.getByPlaceholderText(/min/i);
      screen.getByPlaceholderText(/max/i);
    });
  });

  test('should have tag group type option', async () => {
    const fieldLabel = faker.random.word();
    const tagGroup = fixtures.generate('tagGroup');

    render(
      <FilterDropdown
        fields={[
          {
            type: 'tags',
            field: 'test',
            label: fieldLabel,
            tagGroups: [tagGroup],
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      screen.getByText(fieldLabel);

      const selectInput = document.querySelector(
        '.arco-tree-select-view',
      ) as Element;

      expect(selectInput).toBeInTheDocument();

      await userEvent.click(selectInput);
    });

    screen.getByText(tagGroup.name);

    tagGroup.tags.forEach((tag: { name: string }) =>
      screen.getByText(tag.name),
    );
  });

  test('should have date type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'date',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      screen.getByText(fieldLabel);

      const dateInput = document.querySelector('.arco-picker') as Element;

      expect(dateInput).toBeInTheDocument();
    });
  });

  test('should have date range type option', async () => {
    const fieldLabel = faker.random.word();

    render(
      <FilterDropdown
        fields={[
          {
            type: 'dateRange',
            field: 'test',
            label: fieldLabel,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      screen.getByText(fieldLabel);

      const dateInput = document.querySelector('.arco-picker-range') as Element;

      expect(dateInput).toBeInTheDocument();
    });
  });

  test('should have tree select type option', async () => {
    const fieldLabel = faker.random.word();
    const data = {
      id: faker.datatype.uuid(),
      title: faker.random.words(),
      selectable: false,
      children: [
        {
          id: faker.datatype.uuid(),
          title: faker.random.word(),
        },
      ],
    };

    render(
      <FilterDropdown
        fields={[
          {
            type: 'tree-select',
            field: 'test',
            label: fieldLabel,
            treeData: [data],
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      screen.getByText(fieldLabel);

      const selectInput = document.querySelector(
        '.arco-tree-select-view',
      ) as Element;

      expect(selectInput).toBeInTheDocument();

      await userEvent.click(selectInput);
    });

    screen.getByText(data.title);

    data.children.forEach((child) => screen.getByText(child.title));
  });

  test('should have radio group type option', async () => {
    const fieldLabel = faker.random.word();
    const options = [
      {
        label: faker.random.word(),
        value: faker.datatype.uuid(),
      },
      {
        label: faker.random.word(),
        value: faker.datatype.uuid(),
      },
    ];

    render(
      <FilterDropdown
        fields={[
          {
            type: 'radio-group',
            field: 'test',
            label: fieldLabel,
            options,
          },
        ]}
        value={{
          test: '',
        }}
        onUpdate={vi.fn()}
      />,
    );

    const filterButton = screen.getByRole('button');

    await userEvent.click(filterButton);

    await waitFor(async () => {
      screen.getByText(fieldLabel);

      const radioGroup = document.querySelector('.arco-radio-group') as Element;

      expect(radioGroup).toBeInTheDocument();
    });

    options.forEach((option) => screen.getByText(option.label));
  });
});
