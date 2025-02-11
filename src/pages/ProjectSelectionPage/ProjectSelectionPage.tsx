import React, { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFolderOpen } from 'react-icons/fa';
import { RootState } from 'store/types';
import { selectProject, addProject } from 'store/actions/projectActions';
import { v4 as uuidv4 } from 'uuid';
import { ProjectFormModal } from 'components/ProjectFormModal/ProjectFormModal';
import './ProjectSelectionPage.scss';

// Мемоизированный компонент для отображения карточки проекта
interface Project {
    id: string;
    title: string;
}

interface ProjectCardProps {
    project: Project;
    onSelect: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(({ project, onSelect }) => {
    const handleClick = useCallback(() => {
        onSelect(project.id);
    }, [onSelect, project.id]);

    return (
        <div className="project-card" onClick={handleClick}>
            <FaFolderOpen className="project-icon" />
            <span>{project.title}</span>
        </div>
    );
});

export const ProjectSelectionPage: React.FC = () => {
    const projects = useSelector((state: RootState) => state.projectsState.projects);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    // Обработчик выбора проекта
    const handleSelectProject = useCallback(
        (projectId: string) => {
            dispatch(selectProject(projectId));
            navigate('/tasks');
        },
        [dispatch, navigate]
    );

    // Обработчик добавления нового проекта
    const handleAddProject = useCallback(
        (title: string) => {
            const newProject = {
                id: uuidv4(),
                title,
                tasks: []
            };
            dispatch(addProject(newProject));
        },
        [dispatch]
    );

    // Функции для открытия/закрытия модального окна
    const openModal = useCallback(() => setModalOpen(true), []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    return (
        <div className="project-selection">
            <h1>Выберите проект</h1>
            <div className="project-list">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={handleSelectProject}
                    />
                ))}
            </div>
            <button className="add-project-btn" onClick={openModal}>
                <FaPlus /> Добавить проект
            </button>
            {modalOpen && (
                <ProjectFormModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleAddProject}
                />
            )}
        </div>
    );
};
