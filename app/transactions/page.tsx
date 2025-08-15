import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppTable } from "@/components/AppTable";
import { prisma } from "@/lib/prisma";

export default async function transactionPage({ searchParams }: any) {
  const session = await getServerSession(authOptions);
  const page = Number(searchParams?.page ?? 1);

  if (!session) {
    redirect("/");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-48px)] overflow-y-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
        <Link
          href="/transactions/new"
          className="px-4 py-2 rounded-lg bg-sky-950 text-white hover:bg-sky-900 transition-colors duration-200"
        >
          Nova transação
        </Link>
      </div>
      {transactions.length === 0 ? (
        <div>
          <p className="text-lg font-medium mb-2">
            Nenhuma transação encontrada.
          </p>
          <p className="text-sm">
            Comece criando sua primeira transação para acompanhar seus gastos e
            entradas.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <AppTable page={page} />
        </div>
      )}
    </div>
  );
}
