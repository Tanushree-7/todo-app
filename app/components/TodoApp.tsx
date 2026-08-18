"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  created_at: string;
};

type Filter = "all" | "active" | "completed";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadTodos() {
    try {
      setError(null);
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
      setTodos(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo() {
    const text = input.trim();
    if (!text || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to add");
      const newTodo: Todo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setSaving(false);
    }
  }

  async function toggleTodo(id: string, done: boolean) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      setError("Failed to update todo");
      loadTodos();
    }
  }

  async function deleteTodo(id: string) {
    const prevTodos = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      setError("Failed to delete todo");
      setTodos(prevTodos);
    }
  }

  async function clearCompleted() {
    const completed = todos.filter((t) => t.done);
    setTodos((prev) => prev.filter((t) => !t.done));
    try {
      await Promise.all(
        completed.map((t) => fetch(`/api/todos/${t.id}`, { method: "DELETE" }))
      );
    } catch {
      setError("Failed to clear completed todos");
      loadTodos();
    }
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">
        My To-Do List
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTodo}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm text-slate-500 dark:text-slate-400">
        <span>{remaining} item{remaining !== 1 ? "s" : ""} left</span>
        <div className="flex gap-1">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2 mb-4">
        {loading && (
          <li className="text-center text-slate-400 py-8">Loading…</li>
        )}
        {!loading && filtered.length === 0 && (
          <li className="text-center text-slate-400 py-8">
            {todos.length === 0 ? "No tasks yet — add one above!" : "Nothing here."}
          </li>
        )}
        {!loading &&
          filtered.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 group"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id, !todo.done)}
                className="h-5 w-5 accent-indigo-600 cursor-pointer shrink-0"
              />
              <span
                className={`flex-1 break-words ${
                  todo.done
                    ? "line-through text-slate-400"
                    : "text-slate-800 dark:text-slate-100"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                ✕
              </button>
            </li>
          ))}
      </ul>

      {todos.some((t) => t.done) && (
        <div className="text-center">
          <button
            onClick={clearCompleted}
            className="text-sm text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}
