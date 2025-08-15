import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TransactionForm } from "@/components/TransactionForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function transactionNewPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const categories = await prisma.category.findMany();

  return <div className="flex justify-center items-center h-[calc(100vh-48px)]">
    <TransactionForm category={categories} userId={session.user.id} />
  </div>;
}
