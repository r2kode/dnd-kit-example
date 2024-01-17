import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { PlusIcon } from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import { TaskCard } from "./TaskCard";

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 30,
      },
    })
  );

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    // setColumns([...columns, columnToAdd]);
    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    const updatedTasks = tasks.filter((task) => task.columnId !== id);
    setColumns(filteredColumns);
    setTasks(updatedTasks);
  };

  const updateColumn = (id: Id, title: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(updatedColumns);
  };

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId: Id) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  const updateTask = (id: Id, content: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(updatedTasks);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  const onDragStart = (e: DragStartEvent) => {
    const {
      data: { current },
    } = e.active;

    if (current?.type === "Column") {
      setActiveColumn(current.column);
      return;
    }

    if (current?.type === "Task") {
      setActiveTask(current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over?.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over?.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

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
