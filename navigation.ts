import {
    Boxes,
    FileTextIcon,
    LayoutDashboard,
    LifeBuoy,
    Package,
    ShoppingCart,
    Tag,
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
interface GeneralLink {
    name: string;
    url: string;
    icon: LucideIcon;
}

export interface Data {
    General: GeneralLink[];
    navMain: NavSection[];
    quickLinks: QuickLink[];
}

export const data: Data = {
    General: [
        { name: "Dashboard", url: "/", icon: LayoutDashboard },
        { name: "Products", url: "/products", icon: Package },
        { name: "Inventories", url: "/inventories", icon: Boxes },
        { name: "Categories", url: "/categories", icon: Tag },
    ],
    navMain: [
        {
            title: "Reports",
            icon: FileTextIcon,
            items: [
                { title: "Sales Reports", url: "/sales-reports" },
                { title: "Inventory Reports", url: "/inventory-reports" },
                { title: "Customer Reports", url: "/customer-reports" },
            ],
        },
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