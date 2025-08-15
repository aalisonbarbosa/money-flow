import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { AppPieChart } from "@/components/AppPieChart";
import { BalanceCard } from "@/components/BalanceCard";
import { getBarChartData } from "@/lib/chart/getBarChartData";
import { AppBarChart } from "@/components/AppBarChart";
import { generateChartDataByTransactionType } from "@/lib/chart/getPieChart";

export default async function dashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center px-4 text-center h-[calc(100vh-32px)]">
        <h1 className="text-3xl font-bold text-foreground">Acesso restrito</h1>
        <p className="mt-2 text-muted-foreground">
          Você precisa estar logado para acessar esta página.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      transactions: true,
    },
  });

  if (user?.transactions.length === 0) {
    return (
      <div>
        <p className="text-lg font-medium mb-2">
          Nenhuma transação encontrada.
        </p>
        <p className="text-sm">
          Comece criando sua primeira transação para acompanhar seus gastos e
          entradas.
        </p>
      </div>
    );
  }

  const totalAmountExpenses =
    user?.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, ex) => acc + ex.amount, 0) ?? 0;
  const totalAmountIncomes =
    user?.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, ex) => acc + ex.amount, 0) ?? 0;
  const totalBalance = totalAmountIncomes - totalAmountExpenses;

  const incomeResult = await generateChartDataByTransactionType({
    transactionType: "income",
    userId: user?.id!,
  });
  const expenseResult = await generateChartDataByTransactionType({
    transactionType: "expense",
    userId: user?.id!,
  });

  const barChartData = await getBarChartData(user?.id!);

  return (
    <>
      <div className="grid grid-cols-3 md:flex flex-wrap gap-4 w-full text-slate-50">
        <BalanceCard
          bgColor="bg-sky-950"
          title="Saldo Total"
          value={totalBalance}
        />
        <BalanceCard
          bgColor="bg-emerald-500"
          title="Entradas"
          value={totalAmountIncomes}
        />
        <BalanceCard
          bgColor="bg-red-400"
          title="Saídas"
          value={totalAmountExpenses}
        />
      </div>
      <div className="flex flex-col lg:flex-row md:flex-wrap gap-4 mt-4">
        <div className="flex-1">
          <AppPieChart
            expenseResult={expenseResult}
            incomeResult={incomeResult}
          />
        </div>
        <div className="flex-1">
          <AppBarChart chartData={barChartData} />
        </div>
      </div>
    </>
  );
}
