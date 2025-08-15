import { prisma } from "../prisma";
import { format } from "date-fns";

export async function getIncomeExpenseByMonth(userId: string) {
  const incomes = await prisma.transaction.findMany({
    where: {
      userId,
      type: "income"
    },
    select: {
      amount: true,
      date: true,
    },
  });

  const expenses = await prisma.transaction.findMany({
    where: {
      userId,
      type: "expense"
    }, select: {
      amount: true,
      date: true,
    }
  });

  return { incomes, expenses };
}

function groupByMonth(data: { amount: number; date: Date }[]) {
  const grouped: Record<string, number> = {};

  data.forEach(({ amount, date }) => {
    const key = format(date, "MM/yyyy");
    if (!grouped[key]) {
      grouped[key] = 0;
    }
    grouped[key] += amount;
  });

  return grouped;
}

export async function getBarChartData(userId: string) {
  const { incomes, expenses } = await getIncomeExpenseByMonth(userId);

  const groupedIncomes = groupByMonth(incomes);
  const groupedExpenses = groupByMonth(expenses);

  const allMonths = Array.from(
    new Set([...Object.keys(groupedIncomes), ...Object.keys(groupedExpenses)])
  ).sort((a, b) => {
    const [monthA, yearA] = a.split("/").map(Number);
    const [monthB, yearB] = b.split("/").map(Number);

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    return monthA - monthB;
  });

  const chartData = allMonths.map((month) => ({
    month,
    income: groupedIncomes[month] || 0,
    expense: groupedExpenses[month] || 0,
  }));

  return chartData;
}
