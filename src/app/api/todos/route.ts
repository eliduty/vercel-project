import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "获取待办事项失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "创建待办事项失败" }, { status: 500 });
  }
}