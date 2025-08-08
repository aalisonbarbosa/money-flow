import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { prisma } from "@/lib/prisma";

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  type: string;
}

export const AppTable = async ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
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
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
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
                  ? "text-esmeral-500 text-right"
                  : "text-red-400 text-right"
              }
            >
              {transaction.type === "income" ? "Entrada" : "Saída"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
