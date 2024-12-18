import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, test } from 'vitest';

import ContentHeader from './ContentHeader';

describe('ContentHeader', () => {
  test('it should render', async () => {
    render(
      <MemoryRouter>
        <ContentHeader
          breadcrumbItems={[
            {
              name: 'Tasks',
            },
          ]}
        />
      </MemoryRouter>,
    );
    const contentElement = screen.getByText(/Tasks/i);
    expect(contentElement).toBeInTheDocument();
  });
  test('it should be able to render clickable links', async () => {
    render(
      <MemoryRouter>
        <ContentHeader
          breadcrumbItems={[
            {
              name: 'Tasks',
              path: '/tasks',
            },
          ]}
        />
      </MemoryRouter>,
    );
    const contentElement = screen.getByTestId(/link/i);
    expect(contentElement).toBeInTheDocument();
  });
  test('it should be able to render menu links', async () => {
    const routeChildren = [
      {
        name: 'Human Resources',
        key: 'hr',
      },
      {
        name: 'Finance',
        key: 'finance',
      },
      {
        name: 'Tech',
        key: 'tech',
      },
    ];
    render(
      <MemoryRouter>
        <ContentHeader
          breadcrumbItems={[
            {
              path: '/tasks',
              name: 'Tasks',
            },
            {
              name: 'Business Development',
              children: routeChildren,
            },
            {
              name: 'Generic Task Name',
            },
          ]}
        />
      </MemoryRouter>,
    );

    // Select the dropdown first so the menu opens
    const menuTitle = screen.getAllByText(/Business Development/i)[0];
    await userEvent.click(menuTitle);

    await Promise.all(
      routeChildren.map(async (e) => {
        const item = await waitFor(() =>
          screen.getByTestId(`bcmenuitem:${e.key}`),
        );

        return expect(item).toBeInTheDocument();
      }),
    );
  });
});
