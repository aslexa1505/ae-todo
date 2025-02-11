import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import './TaskFormModal.scss';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        title: string,
        description: string,
        priority: 'low' | 'medium' | 'high',
        files: string[],
        workTime: string,
        finishedAt: string | undefined // null для задач без завершения
    ) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [files, setFiles] = useState<string[]>([]);
    const [duration, setDuration] = useState('');
    const [finishedAt, setFinishedAt] = useState('');

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            onSave(title, description, priority, files, duration, finishedAt);
            setTitle('');
            setDescription('');
            setPriority('medium');
            setFiles([]);
            onClose();
        },
        [onSave, title, description, priority, files, duration, finishedAt, onClose]
    );

    const saveFileToLocalStorage = async (file: any) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        });
    };

    const handleFileChange = async (event: any, setFiles: any) => {
        if (event.target.files) {
            const filePromises = Array.from(event.target.files).map(saveFileToLocalStorage);
            const fileDataUrls = await Promise.all(filePromises);
            setFiles(fileDataUrls);
            localStorage.setItem('taskFiles', JSON.stringify(fileDataUrls)); // Сохранение файлов
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setFiles([]);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="task-form-modal">
                <h2>Создать задачу</h2>
                <form onSubmit={handleSubmit}>
                    <label>Название задачи:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label>Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <label>Приоритет:</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    >
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                    <label>Время в работе:</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Длительность (в часах)"
                        required
                    />
                    <label>Дата окончания:</label>
                    <input
                        type="datetime-local"
                        value={finishedAt}
                        onChange={(e) => setFinishedAt(e.target.value)}
                        required
                    />
                    <label>Файлы (изображения):</label>
                    <input type="file" multiple onChange={(e) => handleFileChange(e, setFiles)} />
                    <div className="buttons">
                        <button type="submit">Создать</button>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
