import Link from "next/link";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { GoogleLogoutButton } from "./GoogleLogoutButton";
import { RxDashboard } from "react-icons/rx";
import { BiTransferAlt } from "react-icons/bi";

export const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex flex-col justify-between items-center h-screen w-64 py-4 bg-blue-900 text-slate-50">
      <nav className="w-full px-4">
        <h1 className="text-3xl font-extrabold text-slate-50">Money Flow</h1>
        <ul className="flex flex-col items-center mt-6 gap-2">
          <li className="hover:bg-blue-950 w-full rounded-sm text-center duration-200 font-semibold">
            <Link href="/" className="flex items-center gap-2 p-2">
              <RxDashboard size={24} />
              Dashboard
            </Link>
          </li>
          <li className="hover:bg-blue-950 w-full rounded-sm text-center duration-200 font-semibold">
            <Link href="/transactions" className="flex items-center gap-2 p-2">
              <BiTransferAlt size={24} />
              Transações
            </Link>
          </li>
        </ul>
      </nav>
      {session ? <GoogleLogoutButton /> : <GoogleLoginButton />}
    </header>
  );
};
