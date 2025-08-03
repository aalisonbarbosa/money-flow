"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export const GoogleLoginButton = () => {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium px-5 py-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      Entrar com Google
    </button>
  );
};
