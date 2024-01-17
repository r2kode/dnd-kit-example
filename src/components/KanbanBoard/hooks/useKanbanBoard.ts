import { useState, useMemo } from "react";
import { Column, Id, Task } from "../../../types";

export const useKanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

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

  return {
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
  };
};
