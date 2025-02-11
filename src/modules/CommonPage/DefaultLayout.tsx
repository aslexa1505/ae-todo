import { PropsWithChildren, useState } from 'react';
import { Header } from '../Header/Header';
import { SideMenu } from '../Menu/SideMenu';
import './DefaultLayout.scss';

export const DefaultLayout = ({ children }: PropsWithChildren<{}>) => {
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    const toggleMenuCollapse = () => setMenuCollapsed((prev) => !prev);

    return (
        <div className="default-layout">
            <SideMenu collapsed={menuCollapsed} toggleCollapse={toggleMenuCollapse} />
            <div className={`main-content ${menuCollapsed ? 'collapsed' : ''}`}>
                <Header />
                <main>{children}</main>
            </div>
        </div>
    );
};
