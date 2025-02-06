import { useParams } from "next/navigation";

export const useDashboardId = () => {
    const params = useParams();
    return params.dashboardId as string;
}