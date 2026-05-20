"use client";

import { useState } from "react";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, data: { completed?: boolean }) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}

export default function TodoItem({ todo, onUpdate, onDelete, isUpdating }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleDelete = async () => {
    if (confirm("确定要删除这个待办事项吗？")) {
      setIsDeleting(true);
      onDelete(todo.id);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
        dark:border-gray-700 shadow-sm transition-all duration-200 
        ${todo.completed ? "opacity-60" : ""} 
        ${isDeleting ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isUpdating || isDeleting}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <h3
          className={`text-base font-medium ${
            todo.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{todo.description}</p>
        )}
        <p className="mt-2 text-xs text-gray-400">
          创建于: {new Date(todo.createdAt).toLocaleString("zh-CN")}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isUpdating || isDeleting}
        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 
          dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        删除
      </button>
    </div>
  );
}