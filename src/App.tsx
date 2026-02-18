// src/App.tsx
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TodoItem from "./TodoItem";

function App() {
  const [newTodoText, setNewTodoText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const todos = useQuery(api.todos.list);
  const createTodo = useMutation(api.todos.create);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);
  const updateTodo = useMutation(api.todos.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    await createTodo({ text: newTodoText });
    setNewTodoText("");
  };

  const startEdit = (todo: { _id: string; text: string }) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    await updateTodo({ id: id as Id<"todos">, text: editText });
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  const filteredTodos = todos?.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const completedTodos = filteredTodos?.filter((todo) => todo.isCompleted);
  const pendingTodos = filteredTodos?.filter((todo) => !todo.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-3xl font-bold">My Tasks</CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              Stay organized with Convex & React
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1"
              />
              <Button type="submit">Add Task</Button>
            </form>

            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <Separator />

            {/* Todo List */}
            <div className="space-y-4">
              {todos === undefined ? (
                <div className="text-center text-muted-foreground py-4">
                  Loading...
                </div>
              ) : filteredTodos?.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  {searchTerm
                    ? "No matching tasks found."
                    : "No tasks yet. Add one above!"}
                </div>
              ) : (
                <>
                  {/* Completed Tasks */}
                  {completedTodos && completedTodos.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-px bg-green-300"></div>
                        <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                          ✓ Completed ({completedTodos.length})
                        </h2>
                        <div className="flex-1 h-px bg-green-300"></div>
                      </div>
                      {completedTodos.map((todo) => (
                        <TodoItem
                          key={todo._id}
                          todo={todo}
                          editingId={editingId}
                          editText={editText}
                          setEditingId={setEditingId}
                          setEditText={setEditText}
                          startEdit={startEdit}
                          saveEdit={saveEdit}
                          cancelEdit={cancelEdit}
                          handleKeyDown={handleKeyDown}
                          toggleTodo={toggleTodo}
                          removeTodo={removeTodo}
                          isCompleted={true}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pending Tasks */}
                  {pendingTodos && pendingTodos.length > 0 && (
                    <div className="space-y-3">
                      {/* Header always shows for pending tasks */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-px bg-indigo-300"></div>
                        <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                          📋 To Do ({pendingTodos.length})
                        </h2>
                        <div className="flex-1 h-px bg-indigo-300"></div>
                      </div>
                      {pendingTodos.map((todo) => (
                        <TodoItem
                          key={todo._id}
                          todo={todo}
                          editingId={editingId}
                          editText={editText}
                          setEditingId={setEditingId}
                          setEditText={setEditText}
                          startEdit={startEdit}
                          saveEdit={saveEdit}
                          cancelEdit={cancelEdit}
                          handleKeyDown={handleKeyDown}
                          toggleTodo={toggleTodo}
                          removeTodo={removeTodo}
                          isCompleted={false}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
