import React from 'react';
import { Task as TaskType } from 'store/types';
import './Task.scss';

interface TaskProps {
    task: TaskType;
    onEdit?: (task: TaskType) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onEdit }) => {
    const subtasksCount = task.subtasks ? task.subtasks.length : 0;

    return (
        <div
            className={`task ${task.status.toLowerCase().replace(' ', '-')}`}
            onClick={() => onEdit && onEdit(task)}
        >
            <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
            </div>
            {task.files && task.files.length > 0 && (
                <div className="task-image-container">
                    <img src={task.files[0]} alt="Preview" className="task-image" />
                </div>
            )}
            <div className="task-body">
                <p>{task.description}</p>
                {subtasksCount > 0 && (
                    <span className="subtasks-count">{subtasksCount} subtasks</span>
                )}
            </div>
            <div className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
            </div>
        </div>
    );
};
