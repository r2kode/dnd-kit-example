import { useState } from "react";

export const useTaskCard = () => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setIsMouseOver(false);
  };

  return {
    isMouseOver,
    editMode,
    setIsMouseOver,
    setEditMode,
    toggleEditMode,
  };
};
