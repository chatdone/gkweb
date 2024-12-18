import { Grid } from '@arco-design/web-react';
import { ReactNode } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import DataList from './DataList';

import { formatToCurrency } from '@/utils/currency.utils';

type Props<T> = {
  draggableId: string;
  title: ReactNode;
  index: number;
  data: T[];
  canDragColumn: boolean;
  canDragCard: boolean;
  renderCard: (item: T) => ReactNode;
  renderFooter?: (columnId: string) => ReactNode;
};

const TotalCard = (data: { data: unknown[] }) => {
  const estimatedBudget = data.data.reduce((acc, cur) => {
    //@ts-ignore
    return acc + (cur?.projectedCost || 0);
  }, 0) as number;

  const actualCost = data.data.reduce((acc, cur) => {
    //@ts-ignore
    return acc + (cur?.actualCost || 0);
  }, 0) as number;

  return (
    <>
      <div className="text-gray-400">Value</div>
      <div className="mt-3 mb-4 rounded bg-white shadow">
        <div>
          <div>
            <div className={`relative h-12 w-full`}>
              <div
                className={`absolute bottom-0 left-0 h-1 border-b border-gray-200`}
                style={{ width: '100%' }}
              />

              <div
                className={`absolute top-0 left-0 flex h-full w-full items-center`}
              >
                <div className="w-1/2 py-2 pl-2">
                  <div className="leading-none">
                    RM{formatToCurrency(estimatedBudget)}
                  </div>
                  <div className="text-xs opacity-50">Budget</div>
                </div>

                <div className="w-1/2 py-2 pl-2 p-2 border-l bg-green-50 text-green-600 border-green-500">
                  <div className="leading-none">
                    RM{formatToCurrency(actualCost)}
                  </div>
                  <div className="text-xs opacity-50">Actual</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const Column = <T,>(props: Props<T>) => {
  const {
    draggableId,
    title,
    index,
    data,
    canDragColumn,
    canDragCard,
    renderCard,
    renderFooter,
  } = props;

  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={!canDragColumn}
    >
      {(provided) => (
        <div className="p-1.5">
          <div
            className="w-72 rounded border border-gray-300 bg-gray-100 px-2 py-3"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <Grid.Row className="py-0 px-2" {...provided.dragHandleProps}>
              {title}
            </Grid.Row>

            <DataList
              droppableId={`${draggableId}-list`}
              data={data}
              canDragCard={canDragCard}
              renderCard={renderCard}
            />
            <TotalCard data={data} />
            {renderFooter?.(draggableId)}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
