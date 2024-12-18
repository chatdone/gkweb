import GroupChart from './GroupChart';
import MembersChart from './MembersChart';
import StatusChart from './StatusChart';
import SummaryChart from './SummaryChart';

import { ProjectPageQuery } from 'generated/graphql-types';

type Props = {
  project: ProjectPageQuery['project'];
};

const ChartView = (props: Props) => {
  const { project } = props;

  return (
    <>
      <div className="flex h-12 items-center border-b border-gray-300"></div>

      <div className="bg-gray-50 p-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatusChart project={project} />
          <GroupChart project={project} />
          <MembersChart project={project} />
          <SummaryChart project={project} />
        </div>
      </div>
    </>
  );
};

export default ChartView;
