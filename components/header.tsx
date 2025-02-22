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

    function isUUID(str: string) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    }

    const getBreadcrumbTitles = (): string[] => {
        // Split the pathname into parts and filter out empty strings
        const pathParts = pathname.split("/").filter(Boolean);

        // If the first part is a dynamic segment (e.g., a UUID), remove it
        if (pathParts.length > 1 && isUUID(pathParts[0])) {
            pathParts.shift();
        }

        // Handle dynamic segments for specific routes first:
        if (pathParts.includes("products")) {
            const productIndex = pathParts.indexOf("products");
            const breadcrumbs = ["Products"];
            if (pathParts.length > productIndex + 1) {
                // Assume additional segments indicate details
                breadcrumbs.push("Product Details");
            }
            return breadcrumbs;
        }
        if (pathParts.includes("inventories")) {
            return ["Inventories"];
        }
        if (pathParts.includes("categories")) {
            return ["Categories"];
        }

        // Check static routes in General
        let currentPath = "";
        for (const part of pathParts) {
            currentPath += "/" + part;
            const generalItem = data.General.find(item => item.url === currentPath);
            if (generalItem) {
                return [generalItem.name];
            }
        }

        // Check static routes in quickLinks
        currentPath = "";
        for (const part of pathParts) {
            currentPath += "/" + part;
            const quickLink = data.quickLinks.find(item => item.url === currentPath);
            if (quickLink) {
                return [quickLink.name];
            }
        }

        // Fallback breadcrumbs if no matches found
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