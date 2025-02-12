"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useDashboardId } from "@/hooks/use-dashboard-id"

export const CategoryFilter = () => {
    const router = useRouter();
    const dashboardId = useDashboardId();
    const pathname = usePathname();
    const params = useSearchParams();
    const categoryId = params.get("categoryId") || "all"
    const from = params.get("from") || ""
    const to = params.get("to") || ""

    const {
        data: categories,
        isLoading: isLoadingCategories,
    } = useGetCategories(dashboardId);

    const onChange = (newValue: string) => {
        const query = {
            categoryId: newValue,
            from,
            to,
        }

        if (newValue === "all") {
            query.categoryId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url)
    }

    return (
        <Select
            value={categoryId}
            onValueChange={onChange}
            disabled={isLoadingCategories}
        >
            <SelectTrigger
                className="outline-none w-full md:w-40 transition h-9 rounded-md px-3 font-normal focus:ring-offset-0 focus:ring-transparent"
            >
                <SelectValue placeholder="Select an category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All categories
                </SelectItem>
                {categories?.map((category) => (
                    <SelectItem value={category.id} key={category.id} >
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}