import React, { useState } from 'react';
import { Modal } from '../Modal/Modal';
import './ProjectFormModal.scss';

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(title);
        setTitle('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="project-form-modal">
                <form onSubmit={handleSubmit}>
                    <label>Название проекта:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
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
