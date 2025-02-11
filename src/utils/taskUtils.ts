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

export const parseDuration = (input: string): number => {
    const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
    const match = input.match(regex);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
};

export const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let result = '';
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;
    if (seconds > 0) result += `${seconds}s`;
    return result || '0s';
};
