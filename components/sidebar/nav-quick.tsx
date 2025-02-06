"use client"

import Link from "next/link"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export function NavQuick({
    items,
    label,
    dashboardId
}: {
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
    label?: string
    dashboardId: string
}) {
    const pathname = usePathname();

    const isActiveLink = (url: string) => {
        const normalizedPath = pathname.replace(`/${dashboardId}`, "") || "/";
        return normalizedPath === url;
    };


    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden py-0">
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild className={isActiveLink(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                            <Link href={`/${dashboardId}${item.url}`}>
                                <item.icon className="w-5 h-5 mr-2" />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
