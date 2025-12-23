import { TodoStats } from '../../types';
import './TodoStats.css';

interface TodoStatsProps {
    stats: TodoStats;
}

export function TodoStatsComponent({ stats }: TodoStatsProps) {
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="stats-container">
            <div className="stat-card total">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total Tasks</span>
                </div>
            </div>

            <div className="stat-card pending">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.pending}</span>
                    <span className="stat-label">Pending</span>
                </div>
            </div>

            <div className="stat-card in-progress">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.inProgress}</span>
                    <span className="stat-label">In Progress</span>
                </div>
            </div>

            <div className="stat-card completed">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.completed}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            <div className="stat-card overdue">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.overdue}</span>
                    <span className="stat-label">Overdue</span>
                </div>
            </div>

            <div className="stat-card progress">
                <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="20" x2="12" y2="10" />
                        <line x1="18" y1="20" x2="18" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                </div>
                <div className="stat-content">
                    <span className="stat-value">{completionRate}%</span>
                    <span className="stat-label">Completed</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
                </div>
            </div>
        </div>
    );
}
