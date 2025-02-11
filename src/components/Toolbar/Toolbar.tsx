import React from 'react';
import { FaSearch, FaSort } from 'react-icons/fa';
import './Toolbar.scss';

interface ToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSortChange: (criteria: string) => void;
    onToggleSortOrder: () => void;
    sortCriteria: string;
    sortOrder: 'asc' | 'desc';
}

export const Toolbar: React.FC<ToolbarProps> = ({
    searchValue,
    onSearchChange,
    onSortChange,
    onToggleSortOrder,
    sortCriteria,
    sortOrder
}) => {
    return (
        <div className="toolbar">
            <div className="toolbar-search">
                <FaSearch className="icon" />
                <input
                    type="text"
                    placeholder="Поиск задач..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="toolbar-sort">
                <button
                    className="toolbar-btn"
                    onClick={() => onSortChange(sortCriteria === 'date' ? 'priority' : 'date')}
                >
                    <FaSort /> Сортировка по {sortCriteria === 'date' ? 'приоритету' : 'дате'}
                </button>
                <button className="toolbar-btn" onClick={onToggleSortOrder}>
                    {sortOrder === 'asc' ? '▲' : '▼'}
                </button>
            </div>
        </div>
    );
};
