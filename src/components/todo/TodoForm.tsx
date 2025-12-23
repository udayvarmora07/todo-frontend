import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Todo, CreateTodoData, UpdateTodoData } from '../../types';
import './TodoForm.css';

interface TodoFormProps {
    todo?: Todo | null;
    onSubmit: (data: CreateTodoData | UpdateTodoData) => Promise<void>;
    onCancel: () => void;
}

export function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending' as Todo['status'],
        priority: 'medium' as Todo['priority'],
        category: '',
        dueDate: '',
    });

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title,
                description: todo.description || '',
                status: todo.status,
                priority: todo.priority,
                category: todo.category || '',
                dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
            });
        }
    }, [todo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit({
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                status: formData.status,
                priority: formData.priority,
                category: formData.category.trim() || undefined,
                dueDate: formData.dueDate || undefined,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <Input
                    label="Title *"
                    name="title"
                    placeholder="What needs to be done?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Add more details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Todo['status'] })}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <Input
                        label="Category"
                        name="category"
                        placeholder="e.g., Work, Personal"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <Input
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {todo ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
}
