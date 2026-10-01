
export const API_URL =
  "https://gtbit-lms-backend.onrender.com";
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function getCurrentUser() {
  return {
    email: localStorage.getItem("email") || "",
    name: localStorage.getItem("name") || "",
    designation: localStorage.getItem("designation") || "",
    role: (localStorage.getItem("role") || "").toLowerCase(),
    token: localStorage.getItem("token") || ""
  };
}

export function clearUser() {
  ["token", "email", "name", "designation", "role"].forEach(key =>
    localStorage.removeItem(key)
  );
}

export function calculateDays(from, to) {
  if (!from || !to) return 0;
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 0;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB");
}
