import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/types';
import './Header.scss';

export const Header: React.FC = () => {
    const selectedProjectId = useSelector(
        (state: RootState) => state.projectsState.selectedProjectId
    );
    const projects = useSelector((state: RootState) => state.projectsState.projects);
    const project = projects.find((p) => p.id === selectedProjectId);

    return (
        <header className="app-header">
            <div className="project-info">
                <h1>{project ? `Выбран проект: ${project.title}` : 'Проект не выбран'}</h1>
            </div>
        </header>
    );
};
