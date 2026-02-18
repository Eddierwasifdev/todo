// convex/todos.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new Todo
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
    });
    return todoId;
  },
});

// Get All Todos
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

// Toggle Completion
export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");
    
    await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
  },
});

// UPDATE: Edit Todo Text
export const update = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { text: args.text });
  },
});

// Delete Todo
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});