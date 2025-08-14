"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeTransaction(formData: FormData) {
    const id = formData.get("transactionId") as string;

    if (!id) return;

    await prisma.transaction.delete({ where: { id } });

    revalidatePath("/transactions");
}