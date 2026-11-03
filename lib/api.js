export async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    signal,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new Error(data.message || "The request failed. Please try again."), {
      status: response.status,
    });
  return data;
}

// Renew an expired access cookie once. The server still requires the live login session.
export async function memberRequest(path, options) {
  try {
    return await request(path, options);
  } catch (error) {
    if (error.status !== 401) throw error;
    await request("/session/access", { method: "POST", signal: options?.signal });
    return request(path, options);
  }
}
