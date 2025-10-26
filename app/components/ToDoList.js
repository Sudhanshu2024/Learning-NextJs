"use client";

import { useEffect, useState } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError("Could not load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return alert("Topic is required");

    try {
      setSubmitting(true);
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create todo");
      }

      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]); // update UI instantly
      setTopic("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">📝 My Todos</h2>

      {/* Add Todo Form */}
      <form
        onSubmit={handleAddTodo}
        className="mb-6 bg-gray-50 p-4 rounded-2xl shadow-sm"
      >
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 mb-2 border rounded-lg"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          rows={2}
        ></textarea>

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
        >
          {submitting ? "Adding..." : "Add Todo"}
        </button>
      </form>

      {/* Loading and Error States */}
      {loading && <p className="text-gray-500 text-center">Loading todos...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Todo List */}
      {!loading && !error && todos.length === 0 && (
        <p className="text-center text-gray-400">No todos yet. Add one above!</p>
      )}

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition"
          >
            <h3 className="font-medium text-lg">{todo.topic}</h3>
            {todo.description && (
              <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
