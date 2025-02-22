"use client"

import { useMountedState } from 'react-use';

import { AddInventoryDialog } from '@/features/inventories/components/add-inventory-dialog';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';
import { InventoryIncomeDialogInfo } from '@/features/inventories/components/info-inventory-dialog';
import { AddSupplierDialog } from '@/features/suppliers/components/add-supplier-dialog';
import { EditSupplierDialog } from '@/features/suppliers/components/edit-supplier-dialog';
import { AddCustomerDialog } from '@/features/customers/components/add-customer-dialog';
import { EditCustomerDialog } from '@/features/customers/components/edit-customer-dialog';


export const DialogProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) return null;


    return (
        <>
            <AddInventoryDialog />
            <InventoryIncomeDialogInfo />

            <AddSupplierDialog />
            <EditSupplierDialog />

            <AddCustomerDialog />
            <EditCustomerDialog />

            <AddProductDialog />
        </>
    )
}