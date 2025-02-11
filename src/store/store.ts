import { createStore } from 'redux';
import rootReducer from './reducers';
import { RootState } from './types';

const LOCAL_STORAGE_KEY = 'my-todo-app-state';
const COOKIE_KEY = 'my-todo-app-selected-project';

// Функция для загрузки состояния из localStorage
function loadState(): RootState | undefined {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!serializedState) return undefined;
        return JSON.parse(serializedState) as RootState;
    } catch (error) {
        console.error('Ошибка загрузки состояния:', error);
        return undefined;
    }
}

// Функция для сохранения состояния в localStorage и записи выбранного проекта в куки
function saveState(state: RootState) {
    try {
        // Сохраняем всё состояние в localStorage
        const serializedState = JSON.stringify(state);
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);

        // В куки сохраняем только selectedProjectId
        const selectedProjectId = state.projectsState.selectedProjectId || '';
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(
            selectedProjectId
        )}; path=/; max-age=${60 * 60 * 24 * 7}`; // куки на 7 дней
    } catch (error) {
        console.error('Ошибка сохранения состояния:', error);
    }
}

const persistedState = loadState();
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
