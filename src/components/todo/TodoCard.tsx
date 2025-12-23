import { Todo } from '../../types';
import './TodoCard.css';

interface TodoCardProps {
    todo: Todo;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: Todo['status']) => void;
}

export function TodoCard({ todo, onEdit, onDelete, onStatusChange }: TodoCardProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = () => {
        if (!todo.dueDate || todo.status === 'completed') return false;
        return new Date(todo.dueDate) < new Date();
    };

    const getStatusIcon = () => {
        switch (todo.status) {
            case 'completed':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                );
            case 'in_progress':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                );
            default:
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
        }
    };

    return (
        <div className={`todo-card ${todo.status} ${isOverdue() ? 'overdue' : ''}`}>
            <div className="todo-card-header">
                <button
                    className={`status-toggle ${todo.status}`}
                    onClick={() => {
                        const nextStatus =
                            todo.status === 'pending'
                                ? 'in_progress'
                                : todo.status === 'in_progress'
                                    ? 'completed'
                                    : 'pending';
                        onStatusChange(todo.id, nextStatus);
                    }}
                    title="Toggle status"
                >
                    {getStatusIcon()}
                </button>

                <div className="todo-priority">
                    <span className={`priority-badge ${todo.priority}`}>
                        {todo.priority}
                    </span>
                </div>
            </div>

            <div className="todo-card-body">
                <h3 className={`todo-title ${todo.status === 'completed' ? 'completed' : ''}`}>
                    {todo.title}
                </h3>
                {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                )}
            </div>

            <div className="todo-card-footer">
                <div className="todo-meta">
                    {todo.category && (
                        <span className="todo-category">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            {todo.category}
                        </span>
                    )}
                    {todo.dueDate && (
                        <span className={`todo-due-date ${isOverdue() ? 'overdue' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formatDate(todo.dueDate)}
                        </span>
                    )}
                </div>

                <div className="todo-actions">
                    <button className="action-btn edit" onClick={() => onEdit(todo)} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button className="action-btn delete" onClick={() => onDelete(todo.id)} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
