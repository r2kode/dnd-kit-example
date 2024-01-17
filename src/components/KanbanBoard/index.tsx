import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { PlusIcon } from "../../icons/PlusIcon";
import { ColumnContainer } from "../ColumnContainer";
import { TaskCard } from "../TaskCard";
import { useKanbanBoard } from "./hooks/useKanbanBoard";
import { useDnd } from "./hooks/useDnd";

export function KanbanBoard() {
  const {
    columns,
    tasks,
    activeColumn,
    activeTask,
    columnsId,
    setColumns,
    setTasks,
    setActiveColumn,
    setActiveTask,
    createNewColumn,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
  } = useKanbanBoard();

  const { sensors, onDragStart, onDragEnd, onDragOver } = useDnd({
    setActiveColumn,
    setActiveTask,
    setColumns,
    setTasks,
    tasks,
    columns,
  });

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto owerflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((tasks) => tasks.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={createNewColumn}
          >
            <PlusIcon />
            Add column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (tasks) => tasks.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
