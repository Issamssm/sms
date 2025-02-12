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
        const categoryId = url.searchParams.get("categoryId"); 

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        const whereCondition: { dashboardId: string; categoryId?: string } = { dashboardId };

        if (categoryId) {
            whereCondition.categoryId = categoryId;
        }

        const products = await db.product.findMany({
            where: whereCondition,
            select: {
                id: true,
                dashboardId: true,
                name: true,
                sellingPrice: true,
                status: true,
                category: {
                    select: {
                        name: true
                    }
                },
                currentStock: true
            }
        });

        const formattedProducts = products.map(product => ({
            ...product,
            sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : 0,
            currentStock: product.currentStock ? Number(product.currentStock) : 0
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
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
            status,
            name,
            sellingPrice,
            stockMethode,
            priceMethode,
            minInventory,
            measureUnit,
            categoryId
        } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }

        const existingProduct = await db.product.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId
            }
        });

        if (existingProduct) {
            return NextResponse.json({ message: "Product name already exists" }, { status: 400 });
        }

        const product = await db.product.create({
            data: {
                dashboardId,
                status,
                name,
                sellingPrice,
                stockMethode,
                priceMethode,
                minInventory,
                measureUnit,
                categoryId,
            },
            select: {
                id: true,
                dashboardId: true,
                name: true,
                sellingPrice: true,
                status: true,
                category: {
                    select: {
                        name: true
                    }
                },
                currentStock: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_POST]', error);
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
            status,
            name,
            sellingPrice,
            stockMethode,
            priceMethode,
            minInventory,
            measureUnit,
            categoryId,
            description,
            warehouseLocation
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
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const existingProduct = await db.product.findFirst({
            where: {
                name: name,
                dashboardId: dashboardId,
                NOT: {
                    id: id
                }
            },
        });

        if (existingProduct) {
            return NextResponse.json({ message: "Product name already exists" }, { status: 400 });
        }

        const product = await db.product.update({
            where: {
                id,
                dashboardId
            },
            data: {
                status,
                name,
                sellingPrice,
                stockMethode,
                priceMethode,
                minInventory,
                measureUnit,
                categoryId,
                description,
                warehouseLocation
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
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
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await db.product.delete({
            where: {
                dashboardId,
                id,
            },
            select: {
                id: true,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};