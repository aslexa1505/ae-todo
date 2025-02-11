import React, { useState, useEffect, useCallback, useMemo, memo, ChangeEvent } from 'react';
import { Task as TaskType, Comment } from 'store/types';
import { Modal } from 'components/Modal/Modal';
import './TaskModal.scss';
import { formatDuration, parseDuration } from 'utils/taskUtils';

interface TaskModalProps {
    task: TaskType;
    onClose: () => void;
    onUpdateTask?: (updatedTask: TaskType) => void; // для обновления задачи в хранилище
    onOpenTask?: (task: TaskType) => void; // для открытия модалки по клику на подзадачу
}

interface CommentItemProps {
    comment: Comment;
    task: TaskType;
    onUpdateTask?: (updatedTask: TaskType) => void;
}

const CommentItem: React.FC<CommentItemProps> = memo(({ comment, task, onUpdateTask }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    const toggleReplyForm = useCallback(() => {
        setShowReplyForm((prev) => !prev);
    }, []);

    const handleAddReply = useCallback(() => {
        if (!replyText.trim() || !onUpdateTask) return;
        const newReply: Comment = {
            id: 'reply-' + Date.now(),
            text: replyText,
            author: 'User',
            createdAt: new Date().toISOString(),
            replies: []
        };

        const updatedReplies = [...(comment.replies ?? []), newReply];
        const updatedComment = { ...comment, replies: updatedReplies };

        // Обновляем список комментариев, заменяя старый комментарий на обновлённый
        const updatedComments = (task.comments ?? []).map((c) =>
            c.id === comment.id ? updatedComment : c
        );
        onUpdateTask({ ...task, comments: updatedComments });
        setReplyText('');
        setShowReplyForm(false);
    }, [replyText, comment, task, onUpdateTask]);

    return (
        <li className="comment-item">
            <div className="comment-content">
                <strong>{comment.author}</strong> ({new Date(comment.createdAt).toLocaleString()}):{' '}
                {comment.text}
            </div>
            <button onClick={toggleReplyForm}>Ответить</button>
            {showReplyForm && (
                <div className="reply-form">
                    <textarea
                        placeholder="Ваш ответ"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={handleAddReply}>Отправить ответ</button>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <ul className="replies">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            task={task}
                            onUpdateTask={onUpdateTask}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});

export const TaskModal: React.FC<TaskModalProps> = ({
    task,
    onClose,
    onUpdateTask,
    onOpenTask
}) => {
    // Режим редактирования
    const [isEditing, setIsEditing] = useState(false);

    // Локальные состояния для редактируемых полей
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [workTime, setWorkTime] = useState(task.workTime || '');
    const [finishedAt, setFinishedAt] = useState(task.finishedAt || '');
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [files, setFiles] = useState<string[]>(task.files || []);

    // Для добавления подзадачи и комментариев
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
    const [newCommentText, setNewCommentText] = useState('');

    // При изменении задачи обновляем локальные состояния
    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
        setWorkTime(task.workTime || '');
        setFinishedAt(task.finishedAt || '');
        setPriority(task.priority);
        setStatus(task.status);
        setFiles(task.files || []);
    }, [task]);

    // Мемоизированное форматирование workTime
    const formattedWorkTime = useMemo(() => {
        if (!workTime) return '';
        const totalSeconds = parseDuration(workTime);
        return formatDuration(totalSeconds);
    }, [workTime]);

    // Обработчик загрузки изображений
    const handleImageUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filePromises = Array.from(e.target.files).map(
            (file) =>
                new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        );
        try {
            const imagesData = await Promise.all(filePromises);
            // Добавляем новые изображения к уже загруженным
            setFiles((prevFiles) => [...prevFiles, ...imagesData]);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // Обработчик удаления изображения по индексу
    const handleDeleteImage = useCallback((index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }, []);

    // Сохранение изменений основной задачи
    const handleSaveChanges = useCallback(() => {
        const updatedTask: TaskType = {
            ...task,
            title,
            description,
            workTime,
            finishedAt,
            priority,
            status,
            files
        };
        onUpdateTask && onUpdateTask(updatedTask);
        setIsEditing(false);
    }, [task, title, description, workTime, finishedAt, priority, status, files, onUpdateTask]);

    // Добавление подзадачи
    const handleAddSubtask = useCallback(() => {
        if (!newSubtaskTitle.trim() || !onUpdateTask) return;
        const newSubtask: TaskType = {
            id: 'sub-' + Date.now(),
            number: (task.subtasks?.length ?? 0) + 1,
            title: newSubtaskTitle,
            description: newSubtaskDescription,
            createdAt: new Date().toISOString(),
            workTime: '',
            finishedAt: '',
            priority: 'medium',
            status: task.status,
            subtasks: [],
            comments: [],
            files: []
        };
        const updatedTask: TaskType = {
            ...task,
            subtasks: [...(task.subtasks ?? []), newSubtask]
        };
        onUpdateTask(updatedTask);
        setNewSubtaskTitle('');
        setNewSubtaskDescription('');
    }, [newSubtaskTitle, newSubtaskDescription, task, onUpdateTask]);

    // Добавление комментария
    const handleAddComment = useCallback(() => {
        if (!newCommentText.trim() || !onUpdateTask) return;
        const newComment: Comment = {
            id: 'comm-' + Date.now(),
            text: newCommentText,
            author: 'User',
            createdAt: new Date().toISOString(),
            replies: []
        };
        const updatedTask: TaskType = {
            ...task,
            comments: [...(task.comments ?? []), newComment]
        };
        onUpdateTask(updatedTask);
        setNewCommentText('');
    }, [newCommentText, task, onUpdateTask]);

    // Мемоизация отрисовки списка подзадач
    const renderedSubtasks = useMemo(() => {
        return (task.subtasks?.length ?? 0) > 0 ? (
            task.subtasks!.map((subtask) => (
                <li
                    key={subtask.id}
                    onClick={() => onOpenTask && onOpenTask(subtask)}
                    className="subtask-item"
                >
                    #{subtask.number} {subtask.title}
                </li>
            ))
        ) : (
            <li>Нет подзадач</li>
        );
    }, [task.subtasks, onOpenTask]);

    const renderedComments = useMemo(() => {
        return (task.comments?.length ?? 0) > 0 ? (
            task.comments!.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    task={task}
                    onUpdateTask={onUpdateTask}
                />
            ))
        ) : (
            <li>Нет комментариев</li>
        );
    }, [task.comments, task, onUpdateTask]);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="task-modal">
                <div className="modal-header">
                    <h2>Детали задачи #{task.number}</h2>
                    <div className="header-actions">
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSaveChanges}>
                                Сохранить изменения
                            </button>
                        ) : (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                Редактировать
                            </button>
                        )}
                    </div>
                </div>
                <div className="modal-content">
                    {/* Основная информация */}
                    <section className="section-details">
                        {isEditing ? (
                            <>
                                <label>Заголовок:</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                                <label>Описание:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <label>Приоритет:</label>
                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value as 'low' | 'medium' | 'high')
                                    }
                                >
                                    <option value="low">Низкий</option>
                                    <option value="medium">Средний</option>
                                    <option value="high">Высокий</option>
                                </select>
                                <label>Статус:</label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value as 'Queue' | 'Development' | 'Done'
                                        )
                                    }
                                >
                                    <option value="Queue">Queue</option>
                                    <option value="Development">Development</option>
                                    <option value="Done">Done</option>
                                </select>
                                <label>Время в работе (формат: 4h30m30s):</label>
                                <input
                                    value={workTime}
                                    onChange={(e) => setWorkTime(e.target.value)}
                                    placeholder="например, 4h30m30s"
                                />
                                <label>Дата окончания:</label>
                                <input
                                    type="datetime-local"
                                    value={finishedAt}
                                    onChange={(e) => setFinishedAt(e.target.value)}
                                />
                                <label>Фото:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                                {files && files.length > 0 && (
                                    <div className="images-preview">
                                        {files.map((src, index) => (
                                            <div className="image-container" key={index}>
                                                <img
                                                    src={src}
                                                    alt={`Preview ${index}`}
                                                    className="preview-image"
                                                />
                                                <button
                                                    type="button"
                                                    className="delete-image-btn"
                                                    onClick={() => handleDeleteImage(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Заголовок:</strong> {title}
                                </p>
                                <p>
                                    <strong>Описание:</strong> {description}
                                </p>
                                <p>
                                    <strong>Приоритет:</strong> {priority}
                                </p>
                                <p>
                                    <strong>Статус:</strong> {status}
                                </p>
                                <p>
                                    <strong>Время в работе:</strong>{' '}
                                    {workTime ? formattedWorkTime : 'Не задано'}
                                </p>
                                <p>
                                    <strong>Дата окончания:</strong>{' '}
                                    {finishedAt
                                        ? new Date(finishedAt).toLocaleString()
                                        : 'Не задана'}
                                </p>
                                <p>
                                    <strong>Дата создания:</strong>{' '}
                                    {new Date(task.createdAt).toLocaleString()}
                                </p>
                                <div className="images-preview">
                                    {files && files.length > 0 ? (
                                        files.map((src, index) => (
                                            <div className="image-container" key={index}>
                                                <img
                                                    src={src}
                                                    alt={`Task ${task.id} file ${index}`}
                                                    className="preview-image"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Нет фото</p>
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                    {/* Подзадачи */}
                    <section className="section-subtasks">
                        <h3>Подзадачи</h3>
                        <ul>{renderedSubtasks}</ul>
                        {isEditing && (
                            <div className="add-subtask">
                                <input
                                    type="text"
                                    placeholder="Название подзадачи"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                />
                                <textarea
                                    placeholder="Описание подзадачи"
                                    value={newSubtaskDescription}
                                    onChange={(e) => setNewSubtaskDescription(e.target.value)}
                                />
                                <button onClick={handleAddSubtask}>Добавить подзадачу</button>
                            </div>
                        )}
                    </section>
                    {/* Комментарии */}
                    <section className="section-comments">
                        <h3>Комментарии</h3>
                        <ul>{renderedComments}</ul>
                        <div className="add-comment">
                            <textarea
                                placeholder="Ваш комментарий"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                            />
                            <button onClick={handleAddComment}>Добавить комментарий</button>
                        </div>
                    </section>
                </div>
            </div>
        </Modal>
    );
};
