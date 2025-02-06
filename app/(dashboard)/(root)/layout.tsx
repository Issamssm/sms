import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    console.log(userId)

    // const dashboard = await db.dashboard.findFirst({
    //     where: {
    //         userId,
    //     }
    // });

    // if (!dashboard) {
    //     const newDashboard = await db.dashboard.create({
    //         data: {
    //             userId,
    //         },
    //     });

    //     redirect(`/${newDashboard.id}`);
    // }

    // if (dashboard) {
    //     redirect(`/${dashboard.id}`);
    // }

    return (
        <>
            {children}
        </>
    )
}
