import { Task } from 'store/types';

export const updateNestedTask = (tasks: Task[], updatedTask: Task): Task[] => {
    return tasks.map((t) => {
        if (t.id === updatedTask.id) {
            return updatedTask;
        }
        if (t.subtasks && t.subtasks.length > 0) {
            return { ...t, subtasks: updateNestedTask(t.subtasks, updatedTask) };
        }
        return t;
    });
};
