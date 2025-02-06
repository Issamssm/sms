"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function NavGroupe({
    items,
    label,
    dashboardId
}: {
    items: {
        title: string;
        icon?: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    label?: string;
    dashboardId: string;
}) {
    const pathname = usePathname();

    const extractPathWithoutDashboardId = (fullPath: string) => {
        const parts = fullPath.split("/").filter(Boolean);
        if (parts.length > 1 && parts[0] === dashboardId) {
            return "/" + parts.slice(1).join("/");
        }
        return "/";
    };

    const normalizedPath = extractPathWithoutDashboardId(pathname);

    // التحقق مما إذا كان الرابط نشطًا
    const isActiveLink = (url: string) => {
        const normalizedUrl = extractPathWithoutDashboardId(`/${dashboardId}${url}`);
        return normalizedPath === normalizedUrl;
    };

    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setOpenItems((prev) => {
            const newOpenItems: Record<string, boolean> = {};
            items.forEach((item) => {
                if (item.items?.some((subItem) => isActiveLink(subItem.url))) {
                    newOpenItems[item.title] = true;
                }
            });

            return JSON.stringify(prev) !== JSON.stringify(newOpenItems) ? newOpenItems : prev;
        });
    }, [normalizedPath, items]);

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}

            <SidebarMenu>
                {items.map((item) => {
                    const isOpen = openItems[item.title] || false;
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={isOpen}
                            onOpenChange={(isOpen) =>
                                setOpenItems((prev) => ({ ...prev, [item.title]: isOpen }))
                            }
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title} aria-expanded={isOpen}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    className={isActiveLink(subItem.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                                                >
                                                    <Link href={`/${dashboardId}${subItem.url}`}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
