"use client"

import * as React from "react"
import Image from "next/image"
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
} from "@/components/ui/sidebar"
import { data } from "@/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="flex items-start p-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Image alt="Logo" src={"/logo.svg"} width={50} height={50} className="h-6 w-6" />
                    <span className="text-xl font-bold text-black group-data-[collapsible=icon]:hidden">StockMate</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                <NavGroupe items={data.navMain} label="General"/>
                <NavGroupe items={data.navSupport} label="Support & contact"/>
                <NavQuick items={data.quickLinks} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
