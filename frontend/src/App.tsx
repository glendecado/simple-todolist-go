import { useEffect, useState } from "react";
import "./App.css"; // Your CSS file for styles

type Todo = {
  ID: number;
  title: string;
  completed: boolean;
};

const API_URL = "http://localhost:3000/todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Global loading counter
  const [loadingCount, setLoadingCount] = useState(0);

  // Helper to wrap async fetches and track loading count
  const withLoading = async (fn: () => Promise<void>) => {
    setLoadingCount((c) => c + 1);
    try {
      await fn();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  };

  // Fetch all todos (Read)
  const fetchTodos = () =>
    withLoading(async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    });

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo
  const createTodo = () =>
    withLoading(async () => {
      if (!newTitle.trim()) return;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, completed: false }),
      });
      if (!res.ok) throw new Error("Failed to create todo");
      const created = await res.json();
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
    });

  // Update a todo (toggle completed)
  const toggleTodo = (id: number, completed: boolean) =>
    withLoading(async () => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const updated = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.ID === id ? updated : todo)));
    });

  // Delete a todo
  const deleteTodo = (id: number) =>
    withLoading(async () => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      setTodos((prev) => prev.filter((todo) => todo.ID !== id));
    });

  return (
    <>
      {/* Global Loading Overlay */}
 
      <div className="max-w-md mx-auto p-4 w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>

        <div className="flex mb-4 w-full">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New todo"
            className="flex-grow border border-gray-300 rounded px-2"
            disabled={loadingCount > 0}
          />
          <button
            onClick={createTodo}
            className="ml-2 bg-blue-500 text-white px-4 rounded disabled:opacity-50"
            disabled={loadingCount > 0 || !newTitle.trim()}
          >
            Add
          </button>
        </div>

        <ul className="w-full">
          {todos.map(({ ID, title, completed }) => (
            <li
              key={ID}
              className="flex items-center justify-between mb-2 border-b pb-2"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => toggleTodo(ID, completed)}
                  disabled={loadingCount > 0}
                />
                <span className={completed ? "line-through" : ""}>{title}</span>
              </label>
              <button
                onClick={() => deleteTodo(ID)}
                className="text-red-500 font-bold text-xl"
                aria-label={`Delete todo ${title}`}
                disabled={loadingCount > 0}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
