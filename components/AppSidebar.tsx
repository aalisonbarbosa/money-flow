import Link from "next/link";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { GoogleLogoutButton } from "./GoogleLogoutButton";
import { RxDashboard } from "react-icons/rx";
import { BiTransferAlt } from "react-icons/bi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export const AppSidebar = async () => {
  const session = await getServerSession(authOptions);

  const items = [
    { title: "Dashboard", url: "/", icon: RxDashboard },
    { title: "Transações", url: "/transactions", icon: BiTransferAlt },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <h1 className="text-3xl font-extrabold">Money Flow</h1>
      </SidebarHeader>
      <SidebarContent className="px-4 flex-1">
        <SidebarMenu className="flex flex-col gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="p-4 rounded-md hover:bg-sky-900/50 hover:text-slate-50 transition-colors"
              >
                <Link href={item.url} className="flex items-center gap-3 w-full">
                  <item.icon className="font-bold"/>
                  <span className="text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-6">
        {session ? <GoogleLogoutButton /> : <GoogleLoginButton />}
      </SidebarFooter>
    </Sidebar>
  );
};