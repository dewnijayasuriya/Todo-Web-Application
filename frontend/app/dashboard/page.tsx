"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import CreateTodoModal from "@/components/CreateTodoModal";
import UpdateTodoModal from "@/components/UpdateTodoModal";
import ViewTodoModal from "@/components/ViewTodoModal";
import { formatDateTime, formatDuration } from "@/components/todoFormUtils";
import type { User } from "@/types/auth";
import type { Todo, TodoCreateResponse, TodoListResponse } from "@/types/todo";

type FilterMode = "all" | "active" | "completed";

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true); // Track whether the todos are being fetched from the backend.
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const fetchTodos = async () => {
    try {
      const response = await api.get<TodoListResponse>("/todos");
      setTodos(response.data.todos ?? []);
    } catch {
      setError("Unable to load your tasks right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const storedUser = window.localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (storedUser) {
      const frameId = window.requestAnimationFrame(() => {
        setCurrentUser(JSON.parse(storedUser) as User); //get the stored user from local storage and converts it back into the javascript object
        void fetchTodos();
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    const frameId = window.requestAnimationFrame(() => {
      void fetchTodos();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [router]);

  const handleTodoCreated = (todo: Todo) => {
    setTodos((previous) => [todo, ...previous]); // dashboard immediately adds the returned Todo to state
    setIsCreateModalOpen(false);
    setError("");
    setSuccess("Todo created successfully.");
  };

  const handleTodoUpdated = (todo: Todo) => {
    setTodos((previous) =>
      previous.map((item) => (item.id === todo.id ? todo : item)),
    );
    setEditingTodo(null);
    setError("");
    setSuccess("Todo updated successfully.");
  };

  // Toggle completion by sending the updated todo to the backend.
  const toggleTodo = async (todo: Todo) => {
    try {
      const formData = new FormData();
      formData.append("title", todo.title);

      if (todo.description) {
        formData.append("description", todo.description);
      }

      formData.append("completed", !todo.completed ? "1" : "0");

      if (todo.start_time) {
        formData.append("start_time", todo.start_time);
      }

      if (todo.end_time) {
        formData.append("end_time", todo.end_time);
      }

      formData.append("_method", "PUT");

      const response = await api.post<TodoCreateResponse>(
        `/todos/${todo.id}`,
        formData,
      );
      setTodos((previous) =>
        previous.map((item) =>
          item.id === todo.id ? response.data.todo : item,
        ),
      );
      setError("");
    } catch {
      setError("The todo status could not be updated.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((previous) => previous.filter((todo) => todo.id !== id)); // use filter to create a new array containing every todo excepts the deleted one
      setError("");
      setSuccess("Todo deleted successfully.");
    } catch {
      setError("The todo could not be deleted.");
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    router.push("/login");
  };

  // handling multiple API requests
  const clearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed); //find all completed Todos

    try {
      await Promise.all(
        //waits untill all of them finish
        completedTodos.map((todo) => api.delete(`/todos/${todo.id}`)), //sends multiple delete reqs
      );
      setTodos((previous) => previous.filter((todo) => !todo.completed)); // removes the completed items from the UI
      setError("");
      setSuccess("Completed todos cleared.");
    } catch {
      setError("Completed todos could not be cleared.");
    }
  };

  // Search and filter the already-fetched todos on the client side.
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    if (!matchesSearch) {
      return false;
    }

    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  const itemsLeft = todos.filter((todo) => !todo.completed).length; //This counts pending Todos.

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
              TODO APP
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              {currentUser ? `Welcome, ${currentUser.name}` : "Your todo board"}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="hidden sm:inline">
              Simple planning for focused work
            </span>
            <button
              onClick={logout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-200 hover:border-slate-300 hover:text-slate-900 cursor-pointer"
              aria-label="Logout"
              title="Logout"
            >
              <svg
                className="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 16.5V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v2.5m4 4.5H3m0 0 3-3m-3 3 3 3"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200 sm:max-w-xs sm:flex-1">
              <span aria-hidden="true">
                <svg
                  className="w-4 h-4 text-body"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search todos"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-5 text-sm">
              {(["all", "active", "completed"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`pb-1 transition duration-200 ${
                    filter === option
                      ? "border-b-2 border-blue-600 text-slate-900"
                      : "border-b-2 border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {option === "active"
                    ? "Pending"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 cursor-pointer"
            >
              + Create Todo
            </button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-600">{success}</p>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex min-h-136 flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <div className="space-y-2">
                  {loading ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                      Loading your tasks...
                    </div>
                  ) : filteredTodos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                        ✎
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        No todos to show.
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Add your first task.
                      </p>
                    </div>
                  ) : (
                    filteredTodos.map((todo) => {
                      const startLabel = formatDateTime(todo.start_time);
                      const endLabel = formatDateTime(todo.end_time);
                      const durationLabel = formatDuration(todo.duration);

                      return (
                        <article
                          key={todo.id}
                          className="group flex items-start gap-3 rounded-2xl px-3 py-3 transition duration-200 hover:bg-slate-50"
                        >
                          <button
                            type="button"
                            onClick={() => void toggleTodo(todo)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
                              todo.completed
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 bg-white text-transparent hover:border-blue-500"
                            }`}
                            aria-label={
                              todo.completed
                                ? "Mark todo as active"
                                : "Mark todo as completed"
                            }
                          >
                            <span className="text-[11px] leading-none">✓</span>
                          </button>

                          {todo.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={todo.image_url}
                              alt=""
                              className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                              <svg
                                className="h-6 w-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M4 16.5 8 12l3 3 5-6 4 5M4 6h16v12H4z"
                                />
                              </svg>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setViewingTodo(todo)}
                            className="min-w-0 flex-1 text-left cursor-pointer"
                          >
                            <p
                              className={`block w-full text-left text-sm leading-6 transition duration-200 ${
                                todo.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-800"
                              }`}
                            >
                              {todo.title}
                            </p>

                            {todo.description ? (
                              <p className="mt-0.5 text-sm text-slate-500">
                                {todo.description}
                              </p>
                            ) : null}

                            {startLabel || endLabel || durationLabel ? (
                              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
                                {startLabel ? <span>Start: {startLabel}</span> : null}
                                {endLabel ? <span>End: {endLabel}</span> : null}
                                {durationLabel ? (
                                  <span>Duration: {durationLabel}</span>
                                ) : null}
                              </p>
                            ) : null}
                          </button>

                          <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => void toggleTodo(todo)}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition duration-200 cursor-pointer ${
                                todo.completed
                                  ? "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              {todo.completed
                                ? "Mark pending"
                                : "Mark completed"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewingTodo(todo)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-slate-100 hover:text-slate-700"
                              aria-label="View todo"
                              title="View"
                            >
                              <svg
                                className="h-4 w-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="2.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTodo(todo)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-slate-100 hover:text-slate-700"
                              aria-label="Edit todo"
                              title="Edit"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteTodo(todo.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-rose-50 hover:text-rose-600"
                              aria-label="Delete todo"
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>{itemsLeft} items left</span>
                <button
                  type="button"
                  onClick={() => void clearCompleted()}
                  disabled={!todos.some((todo) => todo.completed)}
                  className="font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Clear Completed
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>

      {isCreateModalOpen ? (
        <CreateTodoModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleTodoCreated}
        />
      ) : null}

      {editingTodo ? (
        <UpdateTodoModal
          key={editingTodo.id}
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdated={handleTodoUpdated}
        />
      ) : null}

      {viewingTodo ? (
        <ViewTodoModal
          todo={viewingTodo}
          onClose={() => setViewingTodo(null)}
          onEdit={() => {
            setEditingTodo(viewingTodo);
            setViewingTodo(null);
          }}
        />
      ) : null}
    </main>
  );
}
