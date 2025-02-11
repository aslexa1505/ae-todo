import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState, Project, Task } from 'store/types';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import './StatisticsPage.scss';

export const StatisticsPage: React.FC = () => {
    // Получаем выбранный проект из стейта
    const selectedProjectId = useSelector(
        (state: RootState) => state.projectsState.selectedProjectId
    );
    const projects = useSelector((state: RootState) => state.projectsState.projects);
    const project: Project | undefined = useMemo(
        () => projects.find((p) => p.id === selectedProjectId),
        [projects, selectedProjectId]
    );

    // Вычисляем статистику по статусу задач
    const statusData = useMemo(() => {
        if (!project) return [];
        const statusCounts: { [key in Task['status']]: number } = {
            Queue: 0,
            Development: 0,
            Done: 0
        };
        project.tasks.forEach((task) => {
            statusCounts[task.status] += 1;
        });
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [project]);

    // Вычисляем статистику по приоритету задач
    const priorityData = useMemo(() => {
        if (!project) return [];
        const priorityCounts: { [key in Task['priority']]: number } = {
            low: 0,
            medium: 0,
            high: 0
        };
        project.tasks.forEach((task) => {
            priorityCounts[task.priority] += 1;
        });
        return Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
    }, [project]);

    // Задаем цвета для диаграммы по статусу
    const statusColors: { [key: string]: string } = {
        Queue: '#4c6ef5',
        Development: '#ffa94d',
        Done: '#37b24d'
    };

    // Задаем цвета для диаграммы по приоритету
    const priorityColors: { [key: string]: string } = {
        low: '#51cf66',
        medium: '#ff922b',
        high: '#f03e3e'
    };

    // Если проект не выбран, показываем сообщение
    if (!project) {
        return (
            <div className="statistics-page">
                <h2>Проект не выбран</h2>
                <p>Пожалуйста, выберите проект для отображения статистики.</p>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            <h1>Статистика проекта</h1>
            <div className="charts-container">
                <div className="chart-item">
                    <h3>Распределение задач по статусу</h3>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
                <div className="chart-item">
                    <h3>Распределение задач по приоритету</h3>
                    <BarChart width={400} height={300} data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8">
                            {priorityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={priorityColors[entry.name]} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>
            </div>
        </div>
    );
};
