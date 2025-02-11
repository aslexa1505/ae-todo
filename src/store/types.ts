// Комментарий (поддержка каскадных комментариев)
export interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: string;
    replies?: Comment[]; // дочерние комментарии
}

// приоритеты и статусы
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'Queue' | 'Development' | 'Done';

// Задача (с поддержкой вложенных подзадач)
export interface Task {
    id: string;
    number: number;
    title: string;
    description: string;
    createdAt: string;
    workTime?: string;
    finishedAt?: string;
    priority: Priority;
    files?: string[]; // например, ссылки на файлы
    status: Status;
    subtasks?: Task[]; // подзадачи (рекурсивно)
    comments?: Comment[]; // каскадные комментарии
}

// Проект, содержащий задачи
export interface Project {
    id: string;
    title: string;
    tasks: Task[];
}

// Состояние для Redux (на уровне приложения)
export interface AppState {
    projects: Project[];
    selectedProjectId: string | null; // выбранный проект
}

// Если понадобится тип для корневого состояния (при объединении редьюсеров)
export interface RootState {
    projectsState: AppState;
}
