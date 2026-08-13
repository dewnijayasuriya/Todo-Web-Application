"use client";

import Modal from "./Modal";
import { formatDateTime, formatDuration } from "./todoFormUtils";
import type { Todo } from "@/types/todo";

type ViewTodoModalProps = {
  todo: Todo;
  onClose: () => void;
  onEdit: () => void;
};

// Read-only detail view for a single Todo: full image, full description,
// and exact times/duration. No form, no request — just display plus a
// shortcut into editing.
export default function ViewTodoModal({
  todo,
  onClose,
  onEdit,
}: ViewTodoModalProps) {
  const startLabel = formatDateTime(todo.start_time);
  const endLabel = formatDateTime(todo.end_time);
  const durationLabel = formatDuration(todo.duration);

  return (
    <Modal title="Todo Details" onClose={onClose}>
      <div className="space-y-4">
        {todo.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={todo.image_url}
            alt=""
            className="h-56 w-full rounded-xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-300">
            <svg
              className="h-10 w-10"
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

        <div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              todo.completed
                ? "bg-emerald-50 text-emerald-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {todo.completed ? "Completed" : "Pending"}
          </span>

          <h3
            className={`mt-2 text-base font-semibold leading-6 ${
              todo.completed
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {todo.title}
          </h3>

          {todo.description ? (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {todo.description}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">No description.</p>
          )}
        </div>

        {startLabel || endLabel || durationLabel ? (
          <dl className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Start
              </dt>
              <dd className="mt-0.5 text-slate-700">{startLabel ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                End
              </dt>
              <dd className="mt-0.5 text-slate-700">{endLabel ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Duration
              </dt>
              <dd className="mt-0.5 text-slate-700">{durationLabel ?? "—"}</dd>
            </div>
          </dl>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </Modal>
  );
}
