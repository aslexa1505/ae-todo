import React from 'react';
import './NotFoundPage.scss';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Страница не найдена</h2>
            <p>К сожалению, запрашиваемая вами страница не существует.</p>
        </div>
    );
};
