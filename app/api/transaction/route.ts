import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { description, amount, date, categoryId, userId, type } = body;

    const transaction = await prisma.transaction.create({
        data: {
            amount: amount,
            description: description,
            date: date,
            categoryId: categoryId,
            userId: userId,
            type: type,
        }
    })

    return new Response(JSON.stringify(transaction), { status: 201 });
}