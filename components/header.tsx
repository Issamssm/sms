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


    const getBreadcrumbTitles = (): string[] => {
        const pathParts = pathname.split("/").filter(Boolean);

        if (pathParts.length === 0) {
            return ["Dashboard"];
        }

        const breadcrumbs = [];

        // 1. Handle dynamic segments FIRST:
        if (pathParts.includes("products")) {
            breadcrumbs.push("Products"); // Add "Products" as a base breadcrumb

            const productIndex = pathParts.indexOf("products");
            if (pathParts.length > productIndex + 1) {
                // There's a product ID or details after /products/
                breadcrumbs.push("Product Details");  // Or a more specific name if needed
            }
            return breadcrumbs; // Dynamic product route handled.
        }
        if (pathParts.includes("inventories")) {
            breadcrumbs.push("Inventories");
            return breadcrumbs;
        }
        if (pathParts.includes("categories")) {
            breadcrumbs.push("Categories");
            return breadcrumbs;
        }

        // 2. Then handle static routes (General, navMain, quickLinks):
        let currentPath = "/";
        for (const part of pathParts) {
            currentPath += part + "/";
            const generalItem = data.General.find(item => item.url === currentPath.slice(0, -1));
            if (generalItem) {
                breadcrumbs.push(generalItem.name);
                return breadcrumbs;
            }
        }

        // ... (rest of the static route handling code as before: navMain, quickLinks)

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