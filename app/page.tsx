import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="">
        <p></p>
        <p></p>
      </div>
      <div className="">
        <p></p>
        <p></p>
      </div>
      <div className="">
        <p></p>
        <p></p>
      </div>
      {user?.expenses.map((expense) => (
        <div key={expense.id}>
          <p>{expense.description}</p>
          <p>{expense.amount}</p>
          <p>
           categoria: {categories.find(cat => cat.id === expense.categoryId)?.name || "Sem categoria"}
          </p>
        </div>
      ))}
      {user?.incomes.map((income) => (
        <div key={income.id}>
          <p>{income.description}</p>
          <p>{income.amount}</p>
          <p>
           categoria: {categories.find(cat => cat.id === income.categoryId)?.name || "Sem categoria"}
          </p>
        </div>
      ))}
    </div>
  );
}
