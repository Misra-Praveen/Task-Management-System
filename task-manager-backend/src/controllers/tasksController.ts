import type {Request,  Response } from "express";
import { prisma } from "../lib/prisma.js";

// ➤ CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await prisma.task.create({
    data: {
      title,
      userId: req.userId!,
    },
  });

  res.status(201).json(task);
};

// ➤ GET TASKS (Pagination + Filter + Search)
export const getTasks = async (req: Request, res: Response) => {
  const { page = "1", limit = "5", status, search } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);

  const filters: any = {
    userId: req.userId,
  };

  if (status !== undefined) {
    filters.status = status === "true";
  }

  if (search) {
    filters.title = {
      contains: search as string,
      mode: "insensitive",
    };
  }

  const tasks = await prisma.task.findMany({
    where: filters,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
    orderBy: { id: "desc" },
  });

  const total = await prisma.task.count({
    where: filters,
  });

  res.json({
    total,
    page: pageNumber,
    totalPages: Math.ceil(total / limitNumber),
    tasks,
  });
};

// UPDATE TASK
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = await prisma.task.findFirst({
    where: {
      id: Number(id),
      userId: req.userId!,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { title },
  });

  res.json(updated);
};

// DELETE TASK
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id: Number(id),
      userId: req.userId!,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await prisma.task.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Task deleted successfully" });
};

// TOGGLE TASK STATUS
export const toggleTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id: Number(id),
      userId: req.userId!,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { status: !task.status },
  });

  res.json(updated);
};
