import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Task as TaskType } from 'store/types';
import { Column } from 'components/Column/Column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { addTask, updateTask } from 'store/actions/projectActions';
import { TaskFormModal } from 'components/TaskFormModal/TaskFormModal';
import { v4 as uuidv4 } from 'uuid';
import './TasksPage.scss';
import { TaskModal } from 'components/TaskModal/TaskModal';

export const TasksPage: React.FC = () => {
    const selectedProjectId = useSelector(
        (state: RootState) => state.projectsState.selectedProjectId
    );
    const projects = useSelector((state: RootState) => state.projectsState.projects);
    const selectedProject = useMemo(
        () => projects.find((p) => p.id === selectedProjectId),
        [projects, selectedProjectId]
    );

    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentColumn, setCurrentColumn] = useState<'Queue' | 'Development' | 'Done' | null>(
        null
    );
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

    const filteredTasks = useMemo(() => {
        if (!selectedProject) return [];
        const lowerCaseSearch = search.toLowerCase();
        let tasks = selectedProject.tasks.filter((task) =>
            task.title.toLowerCase().includes(lowerCaseSearch)
        );

        if (sortCriteria === 'date') {
            tasks = tasks.slice().sort((a, b) => {
                const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                return sortOrder === 'asc' ? diff : -diff;
            });
        } else if (sortCriteria === 'priority') {
            const priorityOrder: { [key: string]: number } = {
                low: 1,
                medium: 2,
                high: 3
            };
            tasks = tasks.slice().sort((a, b) => {
                const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
                return sortOrder === 'asc' ? diff : -diff;
            });
        }
        return tasks;
    }, [selectedProject, search, sortCriteria, sortOrder]);

    const queueTasks = useMemo(
        () => filteredTasks.filter((task) => task.status === 'Queue'),
        [filteredTasks]
    );
    const developmentTasks = useMemo(
        () => filteredTasks.filter((task) => task.status === 'Development'),
        [filteredTasks]
    );
    const doneTasks = useMemo(
        () => filteredTasks.filter((task) => task.status === 'Done'),
        [filteredTasks]
    );

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const { source, destination, draggableId } = result;
            if (!destination || !selectedProject) return;

            if (destination.droppableId !== source.droppableId) {
                const taskToUpdate = selectedProject.tasks.find((t) => t.id === draggableId);
                if (taskToUpdate) {
                    const updatedTask = {
                        ...taskToUpdate,
                        status: destination.droppableId as 'Queue' | 'Development' | 'Done'
                    };
                    dispatch(updateTask(selectedProject.id, updatedTask));
                }
            }
        },
        [dispatch, selectedProject]
    );

    const toggleSortOrder = useCallback(() => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }, []);

    const handleAddTaskClick = useCallback((column: 'Queue' | 'Development' | 'Done') => {
        setCurrentColumn(column);
        setTaskModalOpen(true);
    }, []);

    const handleTaskSave = useCallback(
        (
            title: string,
            description: string,
            priority: 'low' | 'medium' | 'high',
            files: string[],
            finishedAt: string,
            workTime: string | undefined
        ) => {
            if (selectedProject && currentColumn) {
                const newTask: TaskType = {
                    id: uuidv4(),
                    number: selectedProject.tasks.length + 1,
                    title,
                    description,
                    createdAt: new Date().toISOString(),
                    finishedAt,
                    workTime,
                    priority,
                    status: currentColumn,
                    subtasks: [],
                    comments: [],
                    files
                };
                dispatch(addTask(selectedProject.id, newTask));
            }
            setTaskModalOpen(false);
        },
        [selectedProject, currentColumn, dispatch]
    );

    const handleTaskEdit = useCallback((task: TaskType) => {
        setSelectedTask(task);
    }, []);

    const handleTaskUpdate = useCallback(
        (updatedTask: TaskType) => {
            if (selectedProject) {
                dispatch(updateTask(selectedProject.id, updatedTask));
            }
            setSelectedTask(updatedTask);
        },
        [selectedProject, dispatch]
    );

    if (!selectedProject) {
        return <div>Проект не выбран. Пожалуйста, выберите проект.</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="tasks-page">
                <Toolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    onSortChange={setSortCriteria}
                    onToggleSortOrder={toggleSortOrder}
                    sortOrder={sortOrder}
                    sortCriteria={sortCriteria}
                />
                <div className="columns">
                    <Column
                        title="Queue"
                        tasks={queueTasks}
                        onAddTask={handleAddTaskClick}
                        onEditTask={handleTaskEdit}
                    />
                    <Column
                        title="Development"
                        tasks={developmentTasks}
                        onAddTask={handleAddTaskClick}
                        onEditTask={handleTaskEdit}
                    />
                    <Column
                        title="Done"
                        tasks={doneTasks}
                        onAddTask={handleAddTaskClick}
                        onEditTask={handleTaskEdit}
                    />
                </div>
            </div>
            {taskModalOpen && (
                <TaskFormModal
                    isOpen={taskModalOpen}
                    onClose={() => setTaskModalOpen(false)}
                    onSave={handleTaskSave}
                />
            )}
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdateTask={handleTaskUpdate}
                    onOpenTask={handleTaskEdit}
                />
            )}
        </DragDropContext>
    );
};
