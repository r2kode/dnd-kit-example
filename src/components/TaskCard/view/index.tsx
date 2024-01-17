import { Id, Task } from "../../../types";

type ContentEditType = {
  task: Task;
  toggleEditMode: () => void;
  updateTask: (id: Id, content: string) => void;
};

export function ContentEdit({
  task,
  toggleEditMode,
  updateTask,
}: ContentEditType) {
  return (
    <textarea
      className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
        "
      value={task.content}
      autoFocus
      placeholder="Task content here"
      onBlur={toggleEditMode}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          toggleEditMode();
        }
      }}
      onChange={(e) => updateTask(task.id, e.target.value)}
    />
  );
}
