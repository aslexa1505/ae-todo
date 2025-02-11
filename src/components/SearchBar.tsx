import React, { ChangeEvent } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Поиск задачи..."
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
        </div>
    );
};
