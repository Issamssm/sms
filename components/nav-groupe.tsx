"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"


export function NavGroupe({
    items,
    label
}: {
    items: {
        title: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
    label?: string
}) {
    const pathname = usePathname();

    const isActiveLink = (url: string) => {
        return pathname === url
    };

    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const newOpenItems: Record<string, boolean> = {}
        items.forEach((item) => {
            if (item.items?.some((subItem) => isActiveLink(subItem.url))) {
                newOpenItems[item.title] = true
            }
        })
        setOpenItems(newOpenItems)
    }, [pathname, items])
    
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        open={openItems[item.title]}
                        onOpenChange={(isOpen) => setOpenItems((prev) => ({ ...prev, [item.title]: isOpen }))}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild className={isActiveLink(subItem.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                                                <Link href={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
