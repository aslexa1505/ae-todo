import { Project, Task } from '../types';

// Типы экшенов
export const ADD_PROJECT = 'ADD_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const SELECT_PROJECT = 'SELECT_PROJECT';

export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export const addProject = (project: Project) => ({
    type: ADD_PROJECT,
    payload: project
});

export const updateProject = (project: Project) => ({
    type: UPDATE_PROJECT,
    payload: project
});

export const deleteProject = (projectId: string) => ({
    type: DELETE_PROJECT,
    payload: projectId
});

export const selectProject = (projectId: string | null) => ({
    type: SELECT_PROJECT,
    payload: projectId
});

export const addTask = (projectId: string, task: Task) => ({
    type: ADD_TASK,
    payload: { projectId, task }
});

export const updateTask = (projectId: string, task: Task) => ({
    type: UPDATE_TASK,
    payload: { projectId, task }
});

export const deleteTask = (projectId: string, taskId: string) => ({
    type: DELETE_TASK,
    payload: { projectId, taskId }
});
