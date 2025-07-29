"use client";
import React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home as HomeIcon,
  Video,
  Wallet as WalletCards,
  Image as ImageIcon,
  Gem,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/app/_components/AuthContext";


const MenuItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Create New Video",
    url: "/create-new-video",
    icon: Video,
  },
  {
    title: "Create New Image",
    url: "/create-new-image",
    icon: ImageIcon,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: WalletCards,
  },
];

function AppSidebar() {
  const path = usePathname();
  const { user } = useAuthContext();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 w-full justify-center mt-5">
          <Image src="/logo.svg" alt="logo" width="40" height="40" />
          <span className="font-bold text-2xl">Naught AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Buttons with spacing */}
            <div className="mx-5 mt-6 flex flex-col space-y-3">
              <Link href="/create-new-video">
                <Button variant="destructive" color="primary" className="w-full">
                  +Create New Video
                </Button>
              </Link>
              <Link href="/create-new-image">
                <Button variant="destructive" color="primary" className="w-full">
                  +Create New Image
                </Button>
              </Link>
            </div>

            {/* Gap between buttons and menu items */}
            <div className="h-6" />

            <SidebarMenu>
              {MenuItems.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton isActive={path === menu.url} className="p-5">
                    <Link href={menu?.url} className="flex items-center gap-4 p-3">
                      <menu.icon />
                      <span>{menu?.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter>
        <div className="p-5 border rounded-lg mb-6 bg-gray-800">
          <div className="flex items-center justify-between">
            <Gem className="text-gray-400" />
            <h2 className="text-gray-400">{user?.freeProjectsRemaining} Credits Left</h2>
          </div>
          {/* --- THIS IS THE FIX --- */}
          <Link href="/billing">
            <Button className="w-full mt-3">Buy More Credits</Button>
          </Link>
          {/* --- END OF FIX --- */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
