"use client"

import { useMountedState } from 'react-use';

import { AddInventoryDialog } from '@/features/inventories/components/add-inventory-dialog';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';
import { InventoryIncomeDialogInfo } from '@/features/inventories/components/info-inventory-dialog';


export const DialogProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) return null;


    return (
        <>
            <AddInventoryDialog />
            <AddProductDialog />
            <InventoryIncomeDialogInfo />
        </>
    )
}