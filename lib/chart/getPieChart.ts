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

  const chartData = result.map((item) => ({
    name: item.categoryName,
    value: item.total,
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
