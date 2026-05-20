"use client";

import { useState, FormEvent } from "react";

interface TodoFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

export default function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入待办事项标题..."
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:text-gray-100 
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            描述 <span className="text-gray-400">(可选)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="添加详细描述..."
            rows={2}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:text-gray-100 resize-none
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium 
            rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "添加中..." : "添加待办事项"}
        </button>
      </div>
    </form>
  );
}