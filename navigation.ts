import {
    FileTextIcon,
    LayoutDashboard,
    LifeBuoy,
    ShoppingCart,
    Truck,
    Users,
    type LucideIcon,
} from "lucide-react";

interface NavItem {
    title: string;
    url: string;
}

interface NavSection {
    title: string;
    icon: LucideIcon;
    items: NavItem[];
}

interface QuickLink {
    name: string;
    url: string;
    icon: LucideIcon;
}

export interface Data {
    navMain: NavSection[];
    navSupport: NavSection[];
    quickLinks: QuickLink[];
}

export const data: Data = {
    navMain: [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            items: [
                { title: "Overview", url: "/" },
                { title: "Products", url: "/products" },
                { title: "Inventories", url: "/inventories" },
                { title: "Categories", url: "/categories" },
            ],
        },
        {
            title: "Reports",
            icon: FileTextIcon,
            items: [
                { title: "Sales Reports", url: "/sales-reports" },
                { title: "Inventory Reports", url: "/inventory-reports" },
                { title: "Customer Reports", url: "/customer-reports" },
            ],
        },
    ],
    navSupport: [
        {
            title: "Help & Support",
            icon: LifeBuoy,
            items: [
                { title: "FAQs", url: "/faqs" },
                { title: "Contact Support", url: "/contact-support" },
            ],
        },
    ],
    quickLinks: [
        { name: "Orders", url: "/orders", icon: ShoppingCart },
        { name: "Customers", url: "/customers", icon: Users },
        { name: "Suppliers", url: "/suppliers", icon: Truck },
    ],
};