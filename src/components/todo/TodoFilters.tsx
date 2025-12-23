import { TodoFilters } from '../../types';
import './TodoFilters.css';

interface TodoFiltersProps {
    filters: TodoFilters;
    onFilterChange: (filters: TodoFilters) => void;
    categories: string[];
}

export function TodoFiltersComponent({ filters, onFilterChange, categories }: TodoFiltersProps) {
    return (
        <div className="todo-filters">
            <div className="filters-row">
                <div className="search-wrapper">
                    <svg
                        className="search-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value as TodoFilters['status'] || undefined, page: 1 })}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={filters.priority || ''}
                        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as TodoFilters['priority'] || undefined, page: 1 })}
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    {categories.length > 0 && (
                        <select
                            value={filters.category || ''}
                            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined, page: 1 })}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    )}

                    <select
                        value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'DESC'}`}
                        onChange={(e) => {
                            const [sortBy, sortOrder] = e.target.value.split('-') as [TodoFilters['sortBy'], TodoFilters['sortOrder']];
                            onFilterChange({ ...filters, sortBy, sortOrder });
                        }}
                    >
                        <option value="createdAt-DESC">Newest First</option>
                        <option value="createdAt-ASC">Oldest First</option>
                        <option value="dueDate-ASC">Due Date (Earliest)</option>
                        <option value="dueDate-DESC">Due Date (Latest)</option>
                        <option value="priority-DESC">Priority (High-Low)</option>
                        <option value="priority-ASC">Priority (Low-High)</option>
                        <option value="title-ASC">Title (A-Z)</option>
                        <option value="title-DESC">Title (Z-A)</option>
                    </select>
                </div>
            </div>

            {(filters.status || filters.priority || filters.category || filters.search) && (
                <button
                    className="clear-filters"
                    onClick={() => onFilterChange({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' })}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Clear Filters
                </button>
            )}
        </div>
    );
}
