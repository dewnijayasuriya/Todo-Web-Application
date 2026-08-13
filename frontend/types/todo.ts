export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id?: number;
  start_time: string | null;
  end_time: string | null;
  duration: number | null; // minutes, calculated on the backend
  image_path: string | null;
  image_url: string | null;
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
