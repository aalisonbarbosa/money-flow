import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppTable } from "@/components/AppTable";
import { prisma } from "@/lib/prisma";

export default async function transactionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const income = await prisma.income.findMany({
    where: {
      userId: session.user.id,
    },
  });
  const expense = await prisma.expense.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const allTransactions = [
    ...income.map((item) => ({ ...item, type: "income" })),
    ...expense.map((item) => ({ ...item, type: "expense" })),
  ];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-32px)]">
      <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
    <Link
      href="/transactions/new"
      className="px-4 py-2 rounded-lg bg-sky-950 text-white hover:bg-sky-900 transition-colors duration-200"
    >
      Nova transação
    </Link>
  </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <AppTable transactions={allTransactions} />
      </div>
    </div>
  );
}
