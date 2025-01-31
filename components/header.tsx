"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
    Search
} from "lucide-react";

import { usePathname } from "next/navigation";
import React from "react";
import { data } from "@/navigation";

export default function Header() {
    const pathname = usePathname();

    const getBreadcrumbTitles = (): string[] => {

        for (const section of [...data.navMain, ...data.navSupport]) {
            const foundItem = section.items.find(item => item.url === pathname);
            if (foundItem) {
                return [section.title, foundItem.title];
            }
        }

        const quickLink = data.quickLinks.find(link => link.url === pathname);
        if (quickLink) {
            return [quickLink.name];
        }

        return ["Dashboard", "Overview"];
    };

    const breadcrumbTitles = getBreadcrumbTitles();

    return (
        <header className="flex justify-between h-12 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbTitles.map((title, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                </BreadcrumbItem>
                                {index < breadcrumbTitles.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-slate-500" />
            </Button>
        </header>
    );
}
