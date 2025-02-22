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


        const supplier = await db.supplier.findMany({
            where: {
                dashboardId
            }
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.log('[SUPPLIERS_GET]', error);
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

        const existingSupplier = await db.supplier.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId
            }
        });

        if (existingSupplier) {
            return NextResponse.json({ message: "Supplier name already exists" }, { status: 400 });
        }

        const supplier = await db.supplier.create({
            data: {
                dashboardId,
                name,
                contactInfo,
                address
            }
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.log('[SUPPLIER_POST]', error);
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
            return NextResponse.json({ message: "Supplier ID is required" }, { status: 400 });
        }

        const existingSupplier = await db.supplier.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId,
                NOT: {
                    id: id
                }
            },
        });

        if (existingSupplier) {
            return NextResponse.json({ message: "Supplier name already exists" }, { status: 400 });
        }

        const supplier = await db.supplier.update({
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

        return NextResponse.json(supplier);
    } catch (error) {
        console.log('[SUPPLIER_PATCH]', error);
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
            return new NextResponse("Supplier ID is required", { status: 400 });
        }

        const supplier = await db.supplier.delete({
            where: {
                dashboardId,
                id,
            },
            select: {
                id: true,
            }
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.log('[SUPPLIER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};