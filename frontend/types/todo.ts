export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TodoListResponse {
  todos: Todo[];
}

export interface TodoCreateResponse {
  message: string;
  todo: Todo;
}
