// src/TodoItem.tsx
import { Id } from "../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItemProps {
  todo: {
    _id: Id<"todos">;
    text: string;
    isCompleted: boolean;
    createdAt: number;
  };
  editingId: string | null;
  editText: string;
  setEditingId: (id: string | null) => void;
  setEditText: (text: string) => void;
  startEdit: (todo: { _id: string; text: string }) => void;
  saveEdit: (id: string) => Promise<void>;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent, id: string) => void;
  // ✅ Fix: Use more flexible types for Convex mutations
  toggleTodo: any;
  removeTodo: any;
  isCompleted: boolean;
}

export default function TodoItem({
  todo,
  editingId,
  editText,
  setEditingId,
  setEditText,
  startEdit,
  saveEdit,
  cancelEdit,
  handleKeyDown,
  toggleTodo,
  removeTodo,
  isCompleted,
}: TodoItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
        isCompleted
          ? "bg-muted/50 border-muted opacity-75"
          : "bg-card border-border hover:border-primary/50 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => toggleTodo({ id: todo._id })}
          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />

        {editingId === todo._id ? (
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, todo._id)}
            onBlur={() => saveEdit(todo._id)}
            autoFocus
            className="flex-1"
          />
        ) : (
          <span
            className={`text-base flex-1 ${
              isCompleted ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {editingId === todo._id ? (
          <>
            <Button variant="ghost" size="icon" onClick={() => saveEdit(todo._id)}>
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEdit}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={() => startEdit(todo)}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeTodo({ id: todo._id })}>
              <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}