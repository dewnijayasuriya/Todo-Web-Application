"use client";

import { useState } from "react";
import api from "@/services/api";
import type { Todo, TodoCreateResponse } from "@/types/todo";
import Modal from "./Modal";
import TodoFormFields from "./TodoFormFields";
import {
  toApiDateTime,
  toDateTimeLocalValue,
  validateTodoForm,
  type TodoFormState,
} from "./todoFormUtils";

type UpdateTodoModalProps = {
  todo: Todo;
  onClose: () => void;
  onUpdated: (todo: Todo) => void;
};

// Modal for editing an existing Todo. Form state is pre-filled from the
// Todo passed in and is re-created whenever a different Todo is opened
// (via the `key={todo.id}` the dashboard sets on this component), so the
// component itself never needs to "reset" state on Todo changes.
export default function UpdateTodoModal({
  todo,
  onClose,
  onUpdated,
}: UpdateTodoModalProps) {
  const [form, setForm] = useState<TodoFormState>({
    title: todo.title,
    description: todo.description ?? "",
    startTime: toDateTimeLocalValue(todo.start_time),
    endTime: toDateTimeLocalValue(todo.end_time),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
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

    formData.append("completed", todo.completed ? "1" : "0");

    if (form.startTime) {
      formData.append("start_time", toApiDateTime(form.startTime));
    }

    if (form.endTime) {
      formData.append("end_time", toApiDateTime(form.endTime));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (removeImage) {
      formData.append("remove_image", "1");
    }

    formData.append("_method", "PUT");

    setIsSubmitting(true);

    try {
      const response = await api.post<TodoCreateResponse>(
        `/todos/${todo.id}`,
        formData,
      );
      onUpdated(response.data.todo);
    } catch (err) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message ||
          "The todo could not be updated.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Edit Todo" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TodoFormFields
          form={form}
          onChange={setForm}
          imageFile={imageFile}
          onImageChange={(file) => {
            setImageFile(file);
            setRemoveImage(false);
          }}
          existingImageUrl={todo.image_url}
          onRemoveExistingImage={() => setRemoveImage(true)}
          imageRemoved={removeImage}
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
