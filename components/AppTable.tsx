import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { removeTransaction } from "@/app/actions/transactionActions";
import Link from "next/link";

interface AppTableProps {
  userId: string;
  page: number;
  pageSize?: number;
}

export const AppTable = async ({
  userId,
  page,
  pageSize = 5,
}: AppTableProps) => {
  const skip = (page - 1) * pageSize;

  const [transactions, totalCount, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
      },
      skip,
      take: pageSize,
      orderBy: { date: "desc" },
    }),
    prisma.transaction.count({
      where: {
        userId,
      },
    }),
    prisma.category.findMany(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="h-[318px] flex flex-col justify-between">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[200px]">Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right max-sm:hidden">
              Categoria
            </TableHead>
            <TableHead className="text-right max-sm:hidden">Tipo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-gray-50 h-1/5">
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell
                className={
                  transaction.type === "income"
                    ? "text-emerald-500 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {transaction.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-right max-sm:hidden">
                {categories.find((c) => c.id === transaction.categoryId)?.name}
              </TableCell>
              <TableCell
                className={`${
                  transaction.type === "income"
                    ? "text-emerald-500 text-right"
                    : "text-red-400 text-right"
                } max-sm:hidden`}
              >
                {transaction.type === "income" ? "Entrada" : "Saída"}
              </TableCell>
              <TableCell className="flex justify-end pr-4">
                <form action={removeTransaction}>
                  <input
                    type="hidden"
                    name="transactionId"
                    value={transaction.id}
                  />
                  <button className="cursor-pointer">
                    <Trash2 />
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center gap-2 py-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`?page=${i + 1}`}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-gray-200 font-bold" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};
