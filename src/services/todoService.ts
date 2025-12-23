import api from './api';
import { Todo, CreateTodoData, UpdateTodoData, TodoFilters, TodosResponse, TodoStats } from '../types';

export const todoService = {
  async getTodos(filters?: TodoFilters): Promise<TodosResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<TodosResponse>(`/todos?${params.toString()}`);
    return response.data;
  },

  async getTodoById(id: string): Promise<{ todo: Todo }> {
    const response = await api.get<{ todo: Todo }>(`/todos/${id}`);
    return response.data;
  },

  async createTodo(data: CreateTodoData): Promise<{ message: string; todo: Todo }> {
    const response = await api.post<{ message: string; todo: Todo }>('/todos', data);
    return response.data;
  },

  async updateTodo(id: string, data: UpdateTodoData): Promise<{ message: string; todo: Todo }> {
    const response = await api.put<{ message: string; todo: Todo }>(`/todos/${id}`, data);
    return response.data;
  },

  async deleteTodo(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/todos/${id}`);
    return response.data;
  },

  async getStats(): Promise<{ stats: TodoStats }> {
    const response = await api.get<{ stats: TodoStats }>('/todos/stats');
    return response.data;
  },

  async getCategories(): Promise<{ categories: string[] }> {
    const response = await api.get<{ categories: string[] }>('/todos/categories');
    return response.data;
  },
};
