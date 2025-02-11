import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DefaultLayout } from 'modules/CommonPage/DefaultLayout';
import { ProjectSelectionPage } from 'pages/ProjectSelectionPage/ProjectSelectionPage';
import { TasksPage } from 'pages/TasksPage/TasksPage';
import { StatisticsPage } from 'pages/StatisticsPage/StatisticsPage';
import { NotFoundPage } from 'pages/NotFoundPage/NotFoundPage';

export const App: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path="/" element={<ProjectSelectionPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </DefaultLayout>
    );
};
