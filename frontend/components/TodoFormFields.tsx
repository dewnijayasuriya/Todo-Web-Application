"use client";

import { useEffect, useMemo } from "react";
import ImageDropzone from "./ImageDropzone";
import {
  computeDurationMinutes,
  formatDuration,
  type TodoFormState,
} from "./todoFormUtils";

type TodoFormFieldsProps = {
  form: TodoFormState;
  onChange: (form: TodoFormState) => void;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  existingImageUrl?: string | null;
  onRemoveExistingImage?: () => void;
  imageRemoved?: boolean;
  disabled?: boolean;
};

// The field set shared by the create and update Todo modals: title,
// description, start/end time, a live-computed duration, and image upload
// with preview. Each modal owns its own form state and passes it down.
export default function TodoFormFields({
  form,
  onChange,
  imageFile,
  onImageChange,
  existingImageUrl,
  onRemoveExistingImage,
  imageRemoved,
  disabled,
}: TodoFormFieldsProps) {
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const durationMinutes = computeDurationMinutes(form.startTime, form.endTime);

  return (
    <div className="space-y-4">
      <div>
        <label
          className="mb-1 block text-sm font-medium text-slate-700"
          htmlFor="todo-title"
        >
          Title
        </label>
        <input
          id="todo-title"
          value={form.title}
          onChange={(event) =>
            onChange({ ...form, title: event.target.value })
          }
          placeholder="Add a new todo..."
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[15px] text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white disabled:opacity-60"
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-slate-700"
          htmlFor="todo-description"
        >
          Description
        </label>
        <textarea
          id="todo-description"
          value={form.description}
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          placeholder="Add more detail (optional)"
          rows={2}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white disabled:opacity-60"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700"
            htmlFor="todo-start"
          >
            Start time
          </label>
          <input
            id="todo-start"
            type="datetime-local"
            value={form.startTime}
            onChange={(event) =>
              onChange({ ...form, startTime: event.target.value })
            }
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:bg-white disabled:opacity-60"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700"
            htmlFor="todo-end"
          >
            End time
          </label>
          <input
            id="todo-end"
            type="datetime-local"
            value={form.endTime}
            onChange={(event) =>
              onChange({ ...form, endTime: event.target.value })
            }
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-blue-500 focus:bg-white disabled:opacity-60"
          />
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Duration: {formatDuration(durationMinutes) ?? "—"}
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Image
        </label>

        <ImageDropzone
          id="todo-image"
          previewUrl={
            imagePreview ?? (!imageRemoved ? (existingImageUrl ?? null) : null)
          }
          onFileSelected={onImageChange}
          onRemove={() => {
            onImageChange(null);
            onRemoveExistingImage?.();
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
