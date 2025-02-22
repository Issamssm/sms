import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }


        const customer = await db.customer.findMany({
            where: {
                dashboardId
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.log('[CUSTOMERS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();

        const body = await req.json();
        const {
            name,
            contactInfo,
            address
        } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }

        const existingCustomer = await db.customer.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId
            }
        });

        if (existingCustomer) {
            return NextResponse.json({ message: "Customer name already exists" }, { status: 400 });
        }

        const customer = await db.customer.create({
            data: {
                dashboardId,
                name,
                contactInfo,
                address
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.log('[CUSTOMER_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request
) {
    try {
        const { userId } = await auth();

        const body = await req.json();
        const {
            name,
            contactInfo,
            address
        } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");
        const id = url.searchParams.get("id");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
        }

        const existingCustomer = await db.customer.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId,
                NOT: {
                    id: id
                }
            },
        });

        if (existingCustomer) {
            return NextResponse.json({ message: "Customer name already exists" }, { status: 400 });
        }

        const customer = await db.customer.update({
            where: {
                id,
                dashboardId
            },
            data: {
                name,
                contactInfo,
                address
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.log('[CUSTOMER_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        if (!id) {
            return new NextResponse("Customer ID is required", { status: 400 });
        }

        const customer = await db.customer.delete({
            where: {
                dashboardId,
                id,
            },
            select: {
                id: true,
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.log('[CUSTOMER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};