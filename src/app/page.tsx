"use client";

import { useState, useEffect, useCallback } from "react";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("获取待办事项失败");
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取待办事项失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (title: string, description: string) => {
    setIsAdding(true);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: description || undefined }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "创建待办事项失败");
      }
      const newTodo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建待办事项失败");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateTodo = async (id: string, data: { completed?: boolean }) => {
    setUpdatingIds((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "更新待办事项失败");
      }
      const updatedTodo = await response.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新待办事项失败");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "删除待办事项失败");
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除待办事项失败");
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            待办事项清单
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理你的任务，提高效率
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-900 dark:text-red-300 hover:underline"
            >
              关闭
            </button>
          </div>
        )}

        <TodoForm onSubmit={handleAddTodo} isLoading={isAdding} />

        <div className="flex gap-4 mb-4 text-sm">
          <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
            待处理: {pendingCount}
          </div>
          <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            已完成: {completedCount}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            加载中...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无待办事项，添加一个开始吧！
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                isUpdating={updatingIds.has(todo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}