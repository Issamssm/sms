"use client"

import * as React from "react"
import Link from "next/link"

import { NavQuick } from "@/components/sidebar/nav-quick"
import { NavGroupe } from "@/components/sidebar/nav-groupe"
import { NavUser } from "@/components/sidebar/nav-user"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { data } from "@/navigation"
import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const dashboardId = useDashboardId();
    const pathname = usePathname();
    const { setOpenMobile, isMobile } = useSidebar();

    useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [pathname, isMobile, setOpenMobile]);

    return (
        <Sidebar collapsible="offcanvas" {...props} className="group/sidebar">
            <SidebarHeader className="flex items-start p-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black group-data-[collapsible=icon]:hidden">
                        StockMate
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="overflow-y-auto scrollbar-thin scrollbar-thumb-transparent group-hover/sidebar:scrollbar-thumb-gray-400 group-hover/sidebar:scrollbar-thumb-opacity-100">
                <NavQuick items={data.General} label="General" dashboardId={dashboardId} />
                <NavQuick items={data.quickLinks} label="Partners" dashboardId={dashboardId} />
                <NavGroupe items={data.navMain} label="Support & Reports" dashboardId={dashboardId}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}


