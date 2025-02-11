import React from 'react';
import { Comment as CommentType } from 'store/types';

interface CommentProps {
    comment: CommentType;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
    return (
        <div className="comment">
            <div className="comment-author">{comment.author}</div>
            <div className="comment-text">{comment.text}</div>
            <div className="comment-date">{comment.createdAt}</div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
};
