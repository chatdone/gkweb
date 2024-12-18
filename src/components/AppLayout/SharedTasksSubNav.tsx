import { gql, useQuery } from '@apollo/client';
import { Input, Menu } from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  SharedTaskSubNavQuery,
  SharedTaskSubNavQueryVariables,
} from 'generated/graphql-types';

const SharedTasksSubNav = () => {
  const { taskId } = useParams();

  const { data: queryData } = useQuery<
    SharedTaskSubNavQuery,
    SharedTaskSubNavQueryVariables
  >(sharedTaskSubNavQuery);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    taskId && setActiveKeys([taskId]);
  }, [taskId]);

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const getVisibleTasks = () => {
    if (!queryData?.sharedWithMeTasks?.tasks) {
      return [];
    }

    let tasks = [...queryData.sharedWithMeTasks.tasks];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      tasks = tasks.filter((task) => task?.name?.match(regex));
    }

    return tasks;
  };

  return (
    <div>
      <div className="p-2">
        <Input.Search
          className="my-2 border border-gray-300"
          placeholder="Enter keyword to search"
          value={searchKeyword}
          onChange={handleUpdateSearchKeyword}
        />
      </div>

      <div className="font-heading mt-4 mb-2 px-2 text-xs">Shared with me</div>

      <Menu className="bg-gray-100" selectedKeys={activeKeys}>
        {getVisibleTasks().map((task) => (
          <Link key={task?.id} to={`shared/${task?.id}`}>
            <Menu.Item
              key={task?.id as string}
              className="!bg-gray-100 !pr-1 text-base hover:!bg-gray-200"
            >
              {task?.name}
            </Menu.Item>
          </Link>
        ))}
      </Menu>
    </div>
  );
};

const sharedTaskSubNavQuery = gql`
  query SharedTaskSubNav {
    sharedWithMeTasks {
      tasks {
        id
        name
      }
    }
  }
`;

export default SharedTasksSubNav;
