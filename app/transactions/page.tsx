import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function transactionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>Transaction Page</h1>
      <p>
        This is the transaction page where you can manage your transactions.
      </p>
      <Link href="/transactions/new">
      new
      </Link>
    </div>
  );
}
