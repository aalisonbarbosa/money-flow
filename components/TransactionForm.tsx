"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

interface TransactionFormProps {
  category: {
    name: string;
    id: string;
    type: string;
  }[];
  userId: string;
}

export const TransactionForm = ({ category, userId }: TransactionFormProps) => {
  const [transactionType, setTransactionType] = useState("income");
  const [errors, setErrors] = useState<string[]>([]); 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors: string[] = [];

    const formData = new FormData(e.currentTarget);

    const description = formData.get("description");
    const amountRaw = formData.get("amount");
    const dateRaw = formData.get("date");
    const categoryId = formData.get("category");

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      validationErrors.push("A descrição é obrigatória.");
    }

    if (
      !amountRaw ||
      typeof amountRaw !== "string" ||
      amountRaw.trim() === ""
    ) {
      validationErrors.push("O valor é obrigatório.");
    }

    const amount = parseFloat(amountRaw as string);
    if (isNaN(amount) || amount <= 0) {
      validationErrors.push("Informe um valor válido maior que zero.");
    }

    if (!dateRaw || typeof dateRaw !== "string" || dateRaw.trim() === "") {
      validationErrors.push("A data é obrigatória.");
    } else {
      const date = new Date(dateRaw as string);
      if (isNaN(date.getTime())) {
        validationErrors.push("Informe uma data válida.");
      }
    }

    if (
      !categoryId ||
      typeof categoryId !== "string" ||
      categoryId.trim() === ""
    ) {
      validationErrors.push("A categoria é obrigatória.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      description,
      amount,
      date: new Date(dateRaw as string),
      categoryId,
      userId,
      type: transactionType,
    };

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setErrors(["Erro ao criar entrada no banco de dados."]);
      }
    } catch (error) {
      setErrors(["Erro ao conectar com o servidor."]);
    }

    if (errors.length === 0) redirect("/transactions");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-80 mx-auto bg-slate-50 p-6 rounded-2xl shadow-md space-y-5"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Nova Transação
      </h2>

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descrição
        </label>
        <input
          type="text"
          id="description"
          name="description"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-900"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Valor
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-900"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Data
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-900"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1 text-sm text-gray-700">
          <input
            type="radio"
            name="transactionType"
            value="income"
            checked={transactionType === "income"}
            onChange={(e) => setTransactionType(e.target.value)}
            className="accent-sky-900"
          />
          Entrada
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-700">
          <input
            type="radio"
            name="transactionType"
            value="expense"
            checked={transactionType === "expense"}
            onChange={(e) => setTransactionType(e.target.value)}
            className="accent-red-500"
          />
          Saída
        </label>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Categoria
        </label>
        <select
          name="category"
          id="category"
          required
          className="w-64 rounded-xl border border-gray-300 px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-900"
        >
          {category
            .filter((cat: any) => cat.type === transactionType)
            .map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-sky-950 text-slate-50 py-2 rounded-xl hover:bg-sky-900 transition-all font-medium cursor-pointer duration-200"
      >
        Salvar
      </button>
    </form>
  );
};
