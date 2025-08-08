"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export const TransactionForm = ({ category, userId }: any) => {
  const [transactionType, setTransactionType] = useState("income");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date"),
      categoryId: formData.get("category"),
      userId,
    };

    if (transactionType === "income") {
      try {
        const response = await fetch("/api/income", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Erro ao criar entrada:", error);
      }
    } else {
      try {
        fetch("/api/expense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Erro ao criar despesa:", error);
      }
    }

    redirect("/transactions");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-80 mx-auto bg-slate-50 p-6 rounded-2xl shadow-md space-y-5"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Nova Transação
      </h2>

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
