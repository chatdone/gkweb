import { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import Column from './Column';
import styles from './KanbanBoard.module.less';

import { reorder } from '@/utils/reorder.utils';

export type Column<T> = {
  key: string;
  title: ReactNode;
  data: T[];
};

export type CardPositionChangePayload<T> = {
  card: T;
  destinationColumnId: string;
  originalColumnId?: string;
  destinationIndex: number;
  beforeReorderedList: T[];
  reorderedList: T[];
  destinationList?: T[];
};

type Props<T> = {
  columns: Column<T>[];
  renderCard: (item: T) => ReactNode;
  canDragColumn?: boolean;
  canDragCard?: boolean;
  shouldUpdateOnDragEnd?: boolean;
  renderColumnFooter?: (columnId: string) => ReactNode;
  onCardPositionChange?: (payload: CardPositionChangePayload<T>) => void;
  onDragEnd?: () => void;
};

const KanbanBoard = <T,>(props: Props<T>) => {
  const {
    columns,
    canDragColumn = false,
    canDragCard = false,
    renderCard,
    renderColumnFooter,
    onCardPositionChange,
    shouldUpdateOnDragEnd = true,
    onDragEnd,
  } = props;

  const [columnOrdered, setColumnOrdered] = useState<string[]>([]);
  const [columnData, setColumnData] = useState<{
    [key: string]: T[];
  }>({});

  useEffect(() => {
    const newColumnData: { [key: string]: T[] } = {};

    columns.forEach((column) => {
      newColumnData[column.key] = column.data;
    });

    setColumnData(newColumnData);
    setColumnOrdered(Object.keys(newColumnData));
  }, [columns]);

  const handleDragEnd = (result: DropResult) => {
    onDragEnd?.();

    if (!result.destination || !shouldUpdateOnDragEnd) {
      return;
    }

    const sourceId = result.source.droppableId.replace('-list', '');

    if (result.source.droppableId.includes('list')) {
      const currentList = [...columnData[sourceId]];

      if (result.source.droppableId === result.destination.droppableId) {
        if (result.destination.index === result.source.index) {
          return;
        }

        const reordered = reorder(
          currentList,
          result.source.index,
          result.destination.index,
        );

        const updatedCategories = {
          ...columnData,
          [sourceId]: reordered,
        };

        const duplicateList = Array.from(currentList);
        const [card] = duplicateList.splice(result.source.index);

        onCardPositionChange?.({
          card,
          destinationColumnId: sourceId,
          destinationIndex: result.destination.index,
          reorderedList: reordered,
          beforeReorderedList: currentList,
        });

        setColumnData(updatedCategories);
      } else {
        const nextId = result.destination.droppableId.replace('-list', '');
        const nextList = [...columnData[nextId]];
        const beforeReorderedList = [...nextList];

        const target = currentList[result.source.index];

        currentList.splice(result.source.index, 1);
        nextList.splice(result.destination.index, 0, target);

        const updatedCategories = {
          ...columnData,
          [sourceId]: currentList,
          [nextId]: nextList,
        };

        onCardPositionChange?.({
          card: target,
          destinationColumnId: nextId,
          originalColumnId: sourceId,
          destinationIndex: result.destination.index,
          reorderedList: nextList,
          beforeReorderedList,
        });

        setColumnData(updatedCategories);
      }
    } else if (sourceId === 'board') {
      if (result.destination.index === result.source.index) {
        return;
      }

      const currentList = [...columnOrdered];

      const reordered = reorder(
        currentList,
        result.source.index,
        result.destination.index,
      );

      setColumnOrdered(reordered);
    }
  };

  return (
    <div className={styles.kanban}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping
        >
          {(provided) => (
            <div
              className="flex flex-nowrap"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrdered.map((boardId, index) => (
                <Column
                  key={boardId}
                  draggableId={boardId}
                  title={columns.find((col) => col.key === boardId)?.title}
                  index={index}
                  data={columnData[boardId]}
                  canDragColumn={canDragColumn}
                  canDragCard={canDragCard}
                  renderCard={renderCard}
                  renderFooter={renderColumnFooter}
                />
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
