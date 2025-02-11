import React from 'react';
import { Comment as CommentType } from 'store/types';
import { Comment } from './Comment';

interface CommentListProps {
    comments: CommentType[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <div className="comment-list">
            {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};
