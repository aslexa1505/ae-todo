import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './Toolbar.scss';

interface ToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortCriteria: 'date' | 'priority' | 'number';
    onSortChange: (criteria: 'date' | 'priority' | 'number') => void;
    onToggleSortOrder: () => void;
    sortOrder: 'asc' | 'desc';
}

export const Toolbar: React.FC<ToolbarProps> = ({
    searchValue,
    onSearchChange,
    sortCriteria,
    onSortChange,
    onToggleSortOrder,
    sortOrder
}) => {
    return (
        <div className="toolbar">
            <div className="toolbar-search">
                <FaSearch className="icon" />
                <input
                    type="text"
                    placeholder="Поиск по названию или номеру..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="toolbar-sort">
                <select
                    value={sortCriteria}
                    onChange={(e) => onSortChange(e.target.value as 'date' | 'priority' | 'number')}
                    className="sort-select"
                >
                    <option value="date">Дата создания</option>
                    <option value="priority">Приоритет</option>
                    <option value="number">Номер</option>
                </select>
                <button className="toolbar-btn" onClick={onToggleSortOrder}>
                    {sortOrder === 'asc' ? '▲' : '▼'}
                </button>
            </div>
        </div>
    );
};
