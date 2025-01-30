"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    LayoutDashboard,
    LifeBuoy,
    ShoppingCart,
    Users,
    Truck,
    FileText
} from "lucide-react"

import { NavQuick } from "@/components/nav-quick"
import { DashboardSwitcher } from "@/components/dashboard-switcher"
import { NavUser } from "@/components/nav-user"
import { NavGroupe } from "@/components/nav-groupe"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/",
                },
                {
                    title: "Products",
                    url: "/products",
                },
                {
                    title: "Inventories",
                    url: "/inventories",
                },
                {
                    title: "Categories",
                    url: "/categories",
                },
            ],
        },
        {
            title: "Reports",
            icon: FileText,
            items: [
                {
                    title: "Sales Reports",
                    url: "/test",
                },
                {
                    title: "Inventory Reports",
                    url: "#",
                },
                {
                    title: "Customer Reports",
                    url: "#",
                },
            ],
        }
    ],
    navSupport: [
        {
            title: "Help & Support",
            icon: LifeBuoy,
            items: [
                {
                    title: "FAQs",
                    url: "#",
                },
                {
                    title: "Contact Support",
                    url: "#",
                }
            ],
        }
    ],
    quickLinks: [
        {
            name: "Orders",
            url: "#",
            icon: ShoppingCart,
        },
        {
            name: "Customers",
            url: "#",
            icon: Users,
        },
        {
            name: "Suppliers",
            url: "#",
            icon: Truck,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <DashboardSwitcher dashboards={data.teams} />
            </SidebarHeader>
            <SidebarContent className="gap-0">
                <NavGroupe items={data.navMain} label="Platform"/>
                <NavQuick items={data.quickLinks} />
                <NavGroupe items={data.navSupport} label="Support & contact"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
