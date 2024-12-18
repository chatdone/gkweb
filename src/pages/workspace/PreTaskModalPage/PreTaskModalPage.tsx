import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import {
  useNavigate,
  Location,
  useParams,
  useLocation,
} from 'react-router-dom';

import Modal from '@/components/Modal';

import {
  PreTaskModalPageQuery,
  PreTaskModalPageQueryVariables,
} from 'generated/graphql-types';

const PreTaskModalPage = () => {
  const navigate = useNavigate();
  const { companyId, taskId } = useParams();
  const location = useLocation();

  const { data } = useQuery<
    PreTaskModalPageQuery,
    PreTaskModalPageQueryVariables
  >(preTaskModalPageQuery, {
    variables: {
      taskId: taskId as string,
    },
    skip: !taskId,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!data.task?.project?.id) {
      Modal.error({
        title: 'No Permission',
        content: (
          <div className="text-center">
            You have no permission to view this task because you either do not
            have access to the task or you are not a member of the company the
            task is located in.
          </div>
        ),
      });

      return;
    }

    const projectLocation: Location = {
      key: 'pre-task-modal',
      hash: '',
      pathname: `/${companyId}/project/${data.task.project.id}`,
      search: '',
      state: {
        foregroundLocation: {
          pathname: location.pathname,
        },
      },
    };

    navigate('.', {
      replace: true,
      state: {
        backgroundLocation: projectLocation,
        visible: false,
      },
    });
  }, [data]);

  return <></>;
};

const preTaskModalPageQuery = gql`
  query PreTaskModalPage($taskId: ID!) {
    task(taskId: $taskId) {
      id
      project {
        id
      }
    }
  }
`;

export default PreTaskModalPage;
