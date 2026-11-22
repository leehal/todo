export type Todo = {
  id: number
  title: string
  done: boolean
  createdAt: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.status === 204 ? (undefined as T) : res.json()
}

export const todoApi = {
  list: () => request<Todo[]>('/todos'),
  create: (title: string) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  setDone: (id: number, done: boolean) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) }),
  remove: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
