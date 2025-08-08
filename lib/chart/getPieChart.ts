import { prisma } from "../prisma";

type Props = {
  transactionType: "income" | "expense";
};

export async function generateChartDataByTransactionType({ transactionType }: Props) {
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
