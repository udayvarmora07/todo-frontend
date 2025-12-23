import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { TodoCard } from '../components/todo/TodoCard';
import { TodoForm } from '../components/todo/TodoForm';
import { TodoFiltersComponent } from '../components/todo/TodoFilters';
import { TodoStatsComponent } from '../components/todo/TodoStats';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { todoService } from '../services/todoService';
import { Todo, TodoFilters, TodoStats, CreateTodoData, UpdateTodoData } from '../types';
import './Dashboard.css';

export function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [stats, setStats] = useState<TodoStats | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<TodoFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const fetchTodos = useCallback(async () => {
        try {
            const response = await todoService.getTodos(filters);
            setTodos(response.todos);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    }, [filters]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await todoService.getStats();
            setStats(response.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await todoService.getCategories();
            setCategories(response.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchTodos(), fetchStats(), fetchCategories()]);
            setIsLoading(false);
        };
        loadData();
    }, [fetchTodos, fetchStats, fetchCategories]);

    const handleCreateTodo = async (data: CreateTodoData | UpdateTodoData) => {
        await todoService.createTodo(data as CreateTodoData);
        setIsModalOpen(false);
        await Promise.all([fetchTodos(), fetchStats(), fetchCategories()]);
    };

    const handleUpdateTodo = async (data: CreateTodoData | UpdateTodoData) => {
        if (!editingTodo) return;
        await todoService.updateTodo(editingTodo.id, data as UpdateTodoData);
        setEditingTodo(null);
        setIsModalOpen(false);
        await Promise.all([fetchTodos(), fetchStats(), fetchCategories()]);
    };

    const handleDeleteTodo = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        await todoService.deleteTodo(id);
        await Promise.all([fetchTodos(), fetchStats(), fetchCategories()]);
    };

    const handleStatusChange = async (id: string, status: Todo['status']) => {
        await todoService.updateTodo(id, { status });
        await Promise.all([fetchTodos(), fetchStats()]);
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
    };

    if (isLoading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>My Tasks</h1>
                        <p>Organize and track your todos efficiently</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Task
                    </Button>
                </div>

                {stats && <TodoStatsComponent stats={stats} />}

                <section className="todos-section">
                    <TodoFiltersComponent
                        filters={filters}
                        onFilterChange={setFilters}
                        categories={categories}
                    />

                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <svg
                                width="80"
                                height="80"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                            <h3>No tasks found</h3>
                            <p>
                                {filters.search || filters.status || filters.priority || filters.category
                                    ? 'Try adjusting your filters'
                                    : 'Create your first task to get started'}
                            </p>
                            {!filters.search && !filters.status && !filters.priority && !filters.category && (
                                <Button onClick={() => setIsModalOpen(true)}>Create Task</Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="todos-grid">
                                {todos.map((todo) => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteTodo}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page === 1}
                                        onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="15,18 9,12 15,6" />
                                        </svg>
                                        Previous
                                    </button>
                                    <span className="pagination-info">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page === pagination.totalPages}
                                        onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                                    >
                                        Next
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9,18 15,12 9,6" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTodo ? 'Edit Task' : 'Create New Task'}
                size="md"
            >
                <TodoForm
                    todo={editingTodo}
                    onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
}
