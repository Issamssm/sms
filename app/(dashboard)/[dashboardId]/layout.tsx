import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/header"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode
    params: { dashboardId: string }
}) {

    const { userId } = await auth();
    const { dashboardId } = await params

    if (!userId) {
        redirect('/sign-in');
    }

    const dashboard = await db.dashboard.findFirst({
        where: {
            id: dashboardId,
            userId,
        }
    });

    if (!dashboard) {
        redirect('/');
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <Header />
                {children}
            </main>
        </SidebarProvider>
    )
}
