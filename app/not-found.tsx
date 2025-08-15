"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)]">
      <h1 className="text-6xl font-bold text-sky-950">404</h1>
      <p className="mt-4 text-xl">
        Página não encontrada
      </p>
      <p className="mt-2 text-sm">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-sky-950 px-6 py-2 text-white transition hover:bg-sky-900"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
