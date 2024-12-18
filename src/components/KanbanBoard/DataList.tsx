import { get } from 'lodash-es';
import { ReactNode } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

type Props<T> = {
  droppableId: string;
  data: T[];
  canDragCard: boolean;
  renderCard: (item: T) => ReactNode;
};

const TaskList = <T,>(props: Props<T>) => {
  const { droppableId, data, canDragCard, renderCard } = props;

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="min-h-[10px]"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {data.map((item, index) => (
            <Draggable
              key={get(item, 'id')}
              draggableId={get(item, 'id')}
              index={index}
              isDragDisabled={!canDragCard}
            >
              {(dragProvided) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  {renderCard(item)}
                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
