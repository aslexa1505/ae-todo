import { updateNestedTask } from 'utils/taskUtils';
import {
    ADD_PROJECT,
    ADD_TASK,
    DELETE_PROJECT,
    DELETE_TASK,
    SELECT_PROJECT,
    UPDATE_PROJECT,
    UPDATE_TASK
} from '../actions/projectActions';
import { AppState } from 'store/types';

// Начальное состояние
const initialState: AppState = {
    projects: [],
    selectedProjectId: null
};

const projectsReducer = (state = initialState, action: any): AppState => {
    switch (action.type) {
        case ADD_PROJECT:
            return { ...state, projects: [...state.projects, action.payload] };

        case UPDATE_PROJECT:
            return {
                ...state,
                projects: state.projects.map((project) =>
                    project.id === action.payload.id ? action.payload : project
                )
            };

        case DELETE_PROJECT:
            return {
                ...state,
                projects: state.projects.filter((project) => project.id !== action.payload),
                selectedProjectId:
                    state.selectedProjectId === action.payload ? null : state.selectedProjectId
            };

        case SELECT_PROJECT:
            return { ...state, selectedProjectId: action.payload };

        case ADD_TASK:
            return {
                ...state,
                projects: state.projects.map((project) => {
                    if (project.id === action.payload.projectId) {
                        return {
                            ...project,
                            tasks: [...project.tasks, action.payload.task]
                        };
                    }
                    return project;
                })
            };

        case UPDATE_TASK:
            return {
                ...state,
                projects: state.projects.map((project) => {
                    if (project.id === action.payload.projectId) {
                        return {
                            ...project,
                            tasks: updateNestedTask(project.tasks, action.payload.task)
                        };
                    }
                    return project;
                })
            };

        case DELETE_TASK:
            return {
                ...state,
                projects: state.projects.map((project) => {
                    if (project.id === action.payload.projectId) {
                        return {
                            ...project,
                            tasks: project.tasks.filter((task) => task.id !== action.payload.taskId)
                        };
                    }
                    return project;
                })
            };

        default:
            return state;
    }
};

export default projectsReducer;
