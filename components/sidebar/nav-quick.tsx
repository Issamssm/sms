"use client"

import Link from "next/link"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export function NavQuick({
    items,
}: {
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const pathname = usePathname();

    const isActiveLink = (url: string) => {
        return pathname === url
    };
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden py-0">
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild className={isActiveLink(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
