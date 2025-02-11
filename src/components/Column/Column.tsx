import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from 'store/types';
import { FaPlus } from 'react-icons/fa';
import { Task } from 'components/Task/Task';

import './Column.scss';

interface ColumnProps {
    title: 'Queue' | 'Development' | 'Done';
    tasks: TaskType[];
    onAddTask?: (column: 'Queue' | 'Development' | 'Done') => void;
    onEditTask?: (task: TaskType) => void;
}

export const Column: React.FC<ColumnProps> = ({ title, tasks, onAddTask, onEditTask }) => {
    return (
        <div className="column">
            <div className="column-header">
                <h2>{title}</h2>
                <button className="add-task-btn" onClick={() => onAddTask && onAddTask(title)}>
                    <FaPlus />
                </button>
            </div>
            <Droppable droppableId={title}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(providedDraggable) => (
                                    <div
                                        ref={providedDraggable.innerRef}
                                        {...providedDraggable.draggableProps}
                                        {...providedDraggable.dragHandleProps}
                                    >
                                        <Task task={task} onEdit={onEditTask} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
