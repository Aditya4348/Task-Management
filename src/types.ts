export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Learning' | 'Others';

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  createdAt: string;
  userId: string;
}
