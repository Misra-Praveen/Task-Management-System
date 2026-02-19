"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { getAccessToken, clearTokens } from "@/lib/auth";
import toast from "react-hot-toast";

interface Task {
  id: number;
  title: string;
  status: boolean;
}

export default function Dashboard() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  // 🔥 Get token safely after mount
  useEffect(() => {
    const stored = getAccessToken();

    if (!stored) {
      router.push("/login");
    } else {
      setToken(stored);
    }

    setMounted(true);
  }, []);

  const fetchTasks = async () => {
    if (!token) return;

    try {
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("limit", "5");

      if (search) query.append("search", search);
      if (statusFilter) query.append("status", statusFilter);

      const data = await api(
        `/tasks?${query.toString()}`,
        "GET",
        undefined,
        token
      );

      setTasks(data.tasks || data);
      if (data.totalPages) setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  // 🔥 Fetch when token or page changes
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, page]);

  const handleCreate = async () => {
    if (!newTask.trim() || !token) return;

    try {
      await api("/tasks", "POST", { title: newTask }, token);
      setNewTask("");
      toast.success("Task created");
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const toggleTask = async (id: number) => {
    if (!token) return;

    try {
      await api(`/tasks/${id}/toggle`, "PATCH", undefined, token);
      toast.success("Task updated");
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const editTask = async (id: number) => {
    if (!token) return;

    try {
      await api(`/tasks/${id}`, "PATCH", { title: editedTitle }, token);
      toast.success("Task updated");
      setEditingId(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: number) => {
    if (!token) return;

    try {
      await api(`/tasks/${id}`, "DELETE", undefined, token);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Create Task */}
        <div className="flex gap-2 mb-6">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task"
            className="border p-2 rounded flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>

          <button
            onClick={() => {
              setPage(1);
              fetchTasks();
            }}
            className="bg-gray-700 text-white px-4 rounded"
          >
            Apply
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-gray-500">No tasks found</p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              {editingId === task.id ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              ) : (
                <span
                  className={`flex-1 ${
                    task.status ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="bg-yellow-400 px-3 py-1 rounded text-sm"
                >
                  Toggle
                </button>

                {editingId === task.id ? (
                  <button
                    onClick={() => editTask(task.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditedTitle(task.title);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}