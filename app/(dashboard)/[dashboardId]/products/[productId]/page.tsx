"use client"
import { Button } from "@/components/ui/button"
import { useDeleteProduct } from "@/features/products/api/use-delete-product";
import { useConfirm } from "@/hooks/use-confirm";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { useProductId } from "@/hooks/use-product-id";
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation";

const ProductPage = () => {
    const dashboardId = useDashboardId()
    const productId = useProductId()
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Product",
        "Are you sure you want to delete this product?"
    )

    const deleteMutation = useDeleteProduct(productId, dashboardId);

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    router.replace(`/${dashboardId}/products`);
                }
            });        
        }
    };

    return (
        <>
            <ConfirmDialog />
            <div className="mx-auto w-full px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-xl line-clamp-1 font-semibold tracking-tight md:p-0">
                            Product Details
                        </h1>
                        <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                            On the Product Page, you can view and manage all details related to a specific product.
                            This includes essential information such as the product name, description, price, stock levels, and status.
                        </div>
                    </div>
                    <Button
                        size={"sm"}
                        className="text-sm md:w-auto w-full"
                        variant={"destructive"}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete Product
                    </Button>
                </div>
                test
            </div>
        </>
    )
}

export default ProductPage