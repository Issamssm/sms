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
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { data } from "@/navigation";

export default function Header() {
    const pathname = usePathname();

    const extractPathWithoutDashboardId = (fullPath: string) => {
        const parts = fullPath.split("/").filter(Boolean);
        return parts.length > 1 ? "/" + parts.slice(1).join("/") : "/";
    };

    const normalizedPath = extractPathWithoutDashboardId(pathname);


    const getBreadcrumbTitles = (): string[] => {
        if (normalizedPath === "/") return ["Dashboard"];

        const generalItem = data.General.find(item => {
            console.log("Checking General:", item.name, "=>", item.url);
            return item.url === normalizedPath;
        });

        if (generalItem) {
            return [generalItem.name];
        }

        for (const section of data.navMain) {
            const foundItem = section.items.find(item => {
                console.log("Checking navMain:", section.title, item.title, "=>", item.url);
                return item.url === normalizedPath;
            });

            if (foundItem) {
                return [section.title, foundItem.title];
            }
        }

        const quickLink = data.quickLinks.find(link => {
            console.log("Checking QuickLinks:", link.name, "=>", link.url);
            return link.url === normalizedPath;
        });

        if (quickLink) {
            return [quickLink.name];
        }

        return ["Dashboard", "Overview"];
    };

    const breadcrumbTitles = getBreadcrumbTitles();

    return (
        <header className="flex justify-between bg-gray-100/40 h-12 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2">
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
                                {index < breadcrumbTitles.length - 1 && <BreadcrumbSeparator />}
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
