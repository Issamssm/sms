"use client"

import { useMountedState } from 'react-use';

import { InventoryDialog } from '@/features/inventories/components/add-inventory-dialog';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';


export const DialogProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) return null;


    return (
        <>
            <InventoryDialog />
            <AddProductDialog />
        </>
    )
}