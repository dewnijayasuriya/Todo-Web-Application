"use client";

import { useState } from "react";
import api from "@/services/api";
import type { Todo, TodoCreateResponse } from "@/types/todo";
import Modal from "./Modal";
import TodoFormFields from "./TodoFormFields";
import {
  EMPTY_TODO_FORM,
  toApiDateTime,
  validateTodoForm,
  type TodoFormState,
} from "./todoFormUtils";

type CreateTodoModalProps = {
  onClose: () => void;
  onCreated: (todo: Todo) => void;
};

// Modal for creating a brand-new Todo. Form state is local and always starts
// empty; a successful submit hands the created Todo back to the dashboard
// and closes itself.
export default function CreateTodoModal({
  onClose,
  onCreated,
}: CreateTodoModalProps) {
  const [form, setForm] = useState<TodoFormState>(EMPTY_TODO_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const validationError = validateTodoForm(form, imageFile);

    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());

    if (form.description.trim()) {
      formData.append("description", form.description.trim());
    }

    if (form.startTime) {
      formData.append("start_time", toApiDateTime(form.startTime));
    }

    if (form.endTime) {
      formData.append("end_time", toApiDateTime(form.endTime));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<TodoCreateResponse>("/todos", formData);
      onCreated(response.data.todo);
    } catch (err) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message ||
          "The todo could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Create Todo" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TodoFormFields
          form={form}
          onChange={setForm}
          imageFile={imageFile}
          onImageChange={setImageFile}
          disabled={isSubmitting}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Todo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
