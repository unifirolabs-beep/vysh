const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

function getSessionToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem("vysh_session_token");
  if (!token) {
    token = `guest_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    localStorage.setItem("vysh_session_token", token);
  }
  return token;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const sessionToken = getSessionToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-session-token": sessionToken,
    ...(options.headers as Record<string, string>),
  };

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "An unexpected error occurred",
      };
    }
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error. Please check your connection.",
    };
  }
}
