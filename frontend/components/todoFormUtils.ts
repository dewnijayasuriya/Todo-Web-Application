export type TodoFormState = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

export const EMPTY_TODO_FORM: TodoFormState = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
};

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, matches the backend limit

// Formats a minute count as a compact "1h 30m" style string for display.
export function formatDuration(minutes: number | null): string | null {
  if (minutes === null || Number.isNaN(minutes)) {
    return null;
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

// Mirrors the backend's duration calculation so the user sees it before submitting.
export function computeDurationMinutes(
  startTime: string,
  endTime: string,
): number | null {
  if (!startTime || !endTime) {
    return null;
  }

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return null;
  }

  return Math.round((end - start) / 60000);
}

export function formatDateTime(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Converts an ISO timestamp from the backend into the value a
// `datetime-local` input expects (`YYYY-MM-DDTHH:mm`).
export function toDateTimeLocalValue(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Converts a `datetime-local` input value (no timezone info, interpreted by
// the browser as local wall-clock time) into a real UTC ISO string for the
// API. Without this, the naive string would be sent as-is and later
// re-interpreted as UTC, shifting every displayed time by the user's offset.
export function toApiDateTime(localValue: string): string {
  return new Date(localValue).toISOString();
}

// Validates the shared title/time/image rules used by both create and update forms.
// Returns an error message, or null if the form is valid.
export function validateTodoForm(
  form: TodoFormState,
  imageFile: File | null,
): string | null {
  if (!form.title.trim()) {
    return "A title is required.";
  }

  if (
    form.startTime &&
    form.endTime &&
    new Date(form.endTime) < new Date(form.startTime)
  ) {
    return "End time cannot be earlier than start time.";
  }

  if (imageFile) {
    if (!ACCEPTED_IMAGE_TYPES.includes(imageFile.type)) {
      return "Image must be a JPG, PNG, or WEBP file.";
    }

    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return "Image must be smaller than 5MB.";
    }
  }

  return null;
}
