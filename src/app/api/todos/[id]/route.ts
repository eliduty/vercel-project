import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json({ error: "待办事项不存在" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "获取待办事项失败" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, completed } = body;

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "待办事项不存在" }, { status: 404 });
    }

    const updateData: {
      title?: string;
      description?: string | null;
      completed?: boolean;
    } = {};

    if (title !== undefined) {
      if (title.trim() === "") {
        return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "更新待办事项失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "待办事项不存在" }, { status: 404 });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    return NextResponse.json({ error: "删除待办事项失败" }, { status: 500 });
  }
}