import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { PieChartWithLegend } from "@/components/PieChartWithLegend";
import { ChartConfig } from "@/components/ui/chart";

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

  const expenseByCategory = await prisma.expense.groupBy({
    by: ["categoryId"],
    _sum: {
      amount: true,
    },
  });

  const result = await Promise.all(
    expenseByCategory.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return {
        categoryName: category?.name || "Sem categoria",
        total: item._sum.amount!,
      };
    })
  ); // deixar esse código dinâmico entre income e expense

  const chartData = result.map((item) => ({
    name: item.categoryName,
    value: item.total,
  }));

  const categories = await Promise.all(
    expenseByCategory.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return category
    })
  ); 

  const config: ChartConfig = categories.reduce((acc, item) => {
    if (item) {
      acc[item.name] = { label: item.name };
    }
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="ml-[28px] mt-2">
      <div className="flex flex-wrap gap-4 w-full text-slate-50">
        <div className="bg-sky-950 rounded-lg p-4 shadow-md w-56 font-semibold">
          <p className="text-sm font-semibold">Saldo Total</p>
          <p className="text-2xl mt-2">R$ {totalBalance}</p>
        </div>

        <div className="bg-emerald-500 rounded-lg p-4 shadow-md w-56 font-semibold">
          <p className="text-sm font-semibold">Entradas</p>
          <p className="text-2xl mt-2">R$ {totalAmountIncomes}</p>
        </div>

        <div className="bg-red-400 rounded-lg p-4 shadow-md w-56 font-semibold">
          <p className="text-sm font-semibold">Saídas</p>
          <p className="text-2xl mt-2">R$ {totalAmountExpenses}</p>
        </div>
      </div>
      <div>
        <PieChartWithLegend data={chartData} config={config}/>
      </div>
    </div>
  );
}
