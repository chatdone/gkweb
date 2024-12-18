import GroupChart from './GroupChart';
import MembersChart from './MembersChart';
import StatusChart from './StatusChart';
import SummaryChart from './SummaryChart';

import { WorkspacePageQuery } from 'generated/graphql-types';

type Props = {
  workspace: WorkspacePageQuery['workspace'];
};

const ChartView = (props: Props) => {
  const { workspace } = props;

  return (
    <>
      <div className="flex h-12 items-center border-b border-gray-300"></div>

      <div className="overflow-auto bg-gray-50 p-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatusChart workspace={workspace} />
          <GroupChart workspace={workspace} />
          <MembersChart workspace={workspace} />
          <SummaryChart workspace={workspace} />
        </div>
      </div>
    </>
  );
};

export default ChartView;
