import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaProjectDiagram, FaTasks, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import './SideMenu.scss';

interface SideMenuProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ collapsed, toggleCollapse }) => {
    return (
        <div className={`side-menu ${collapsed ? 'collapsed' : ''}`}>
            <button className="collapse-button" onClick={toggleCollapse}>
                {collapsed ? <FaBars /> : <FaTimes />}
            </button>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">
                            <FaProjectDiagram className="menu-icon" />{' '}
                            {!collapsed && <span>Проекты</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks">
                            <FaTasks className="menu-icon" />{' '}
                            {!collapsed && <span>Мои задачи</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/statistics">
                            <FaChartBar className="menu-icon" />{' '}
                            {!collapsed && <span>Статистика</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
