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

interface AppTableProps {
  transactions: {
    id: string;
    userId: string;
    amount: number;
    description: string;
    date: Date;
    categoryId: string;
    type: string;
  }[];
}

export const AppTable = async ({ transactions }: AppTableProps) => {
  const categories = await prisma.category.findMany();

  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="w-[200px]">Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Categoria</TableHead>
          <TableHead className="text-right">Tipo</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="hover:bg-gray-50">
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
            <TableCell className="text-right">
              {
                categories.find(
                  (category) => category.id === transaction.categoryId
                )?.name
              }
            </TableCell>
            <TableCell
              className={
                transaction.type === "income"
                  ? "text-emerald-500 text-right"
                  : "text-red-400 text-right"
              }
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
  );
};
