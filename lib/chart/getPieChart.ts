import { prisma } from "../prisma";

type Props = {
  transactionType: "income" | "expense";
  userId: string;
};

export async function generateChartDataByTransactionType({ transactionType, userId }: Props) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: transactionType
    }
  })

  const result = await Promise.all(
    transactions.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return {
        categoryName: category?.name || "Sem categoria",
        total: item.amount!,
      };
    })
  );

  const grouped = result.reduce((acc, item) => {
    acc[item.categoryName] = (acc[item.categoryName] || 0) + item.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));
  const categories = await Promise.all(
    transactions.map(async (item) => {
      const category = await prisma.category.findUnique({
        where: { id: item.categoryId },
      });

      return category;
    })
  );

  return { chartData, categories };
}
