import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { description, amount, date, categoryId, userId } = body;

  if (!description || !amount || !date || !categoryId || !userId) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  try {
    const income = await prisma.income.create({
      data: {
        description,
        amount,
        date: new Date(date),
        categoryId,
        userId,
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar entrada." }, { status: 500 });
  }
}