import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { PieChartWithLegend } from "@/components/PieChartWithLegend";
import { ChartConfig } from "@/components/ui/chart";
import { BalanceCard } from "@/components/BalanceCard";

export default async function dashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Você precisa estar logado</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      expenses: true,
      incomes: true,
    },
  });

  const totalAmountExpenses =
    user?.expenses.reduce((acc, ex) => acc + ex.amount, 0) ?? 0;
  const totalAmountIncomes =
    user?.incomes.reduce((acc, ex) => acc + ex.amount, 0) ?? 0;
  const totalBalance = totalAmountIncomes - totalAmountExpenses;

  const incomeResult = await getChartDataByTransactionType({
    transactionType: "income",
  });
  const expenseResult = await getChartDataByTransactionType({
    transactionType: "expense",
  });

  return (
    <div className="ml-7 mt-2">
      <div className="flex flex-wrap gap-4 w-full text-slate-50">
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
      <div className="mt-4">
        <PieChartWithLegend
          expenseResult={expenseResult}
          incomeResult={incomeResult}
        />
      </div>
    </div>
  );
}

type Props = {
  transactionType: "income" | "expense";
};

async function getChartDataByTransactionType({ transactionType }: Props) {
  let transactionByCategory;

  if (transactionType === "income") {
    transactionByCategory = await prisma.income.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
    });
  } else {
    transactionByCategory = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
    });
  }

  const result = await Promise.all(
    transactionByCategory.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return {
        categoryName: category?.name || "Sem categoria",
        total: item._sum.amount!,
      };
    })
  );

  const chartData = result.map((item) => ({
    name: item.categoryName,
    value: item.total,
  }));

  const categories = await Promise.all(
    transactionByCategory.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return category;
    })
  );

  return { chartData, categories };
}
