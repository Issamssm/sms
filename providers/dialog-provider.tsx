"use client"

import { useMountedState } from 'react-use';

import { AddInventoryDialog } from '@/features/inventories/components/add-inventory-dialog';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';
import { EditInventoryDialog } from '@/features/inventories/components/edit-inventory-dialog';


export const DialogProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) return null;


    return (
        <>
            <AddInventoryDialog />
            <EditInventoryDialog />
            <AddProductDialog />
        </>
    )
}