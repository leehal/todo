import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { todoApi } from './api'

export default function App() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')

  const todos = useQuery({ queryKey: ['todos'], queryFn: todoApi.list })
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['todos'] })

  const create = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      setTitle('')
      refresh()
    },
  })
  const toggle = useMutation({
    mutationFn: ({ id, done }: { id: number; done: boolean }) => todoApi.setDone(id, done),
    onSuccess: refresh,
  })
  const remove = useMutation({ mutationFn: todoApi.remove, onSuccess: refresh })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (title.trim()) create.mutate(title)
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Todo</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요"
          maxLength={200}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={create.isPending || !title.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          추가
        </button>
      </form>

      {todos.isPending && <p className="text-gray-500">불러오는 중…</p>}
      {todos.isError && (
        <p className="text-red-600">서버에 연결할 수 없어요. 백엔드가 실행 중인지 확인하세요.</p>
      )}
      {todos.data?.length === 0 && <p className="text-gray-500">할 일이 없어요.</p>}

      <ul className="divide-y divide-gray-200">
        {todos.data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => toggle.mutate({ id: todo.id, done: e.target.checked })}
              className="size-5"
            />
            <span className={`flex-1 ${todo.done ? 'text-gray-400 line-through' : ''}`}>
              {todo.title}
            </span>
            <button
              onClick={() => remove.mutate(todo.id)}
              className="text-sm text-gray-400 hover:text-red-600"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
