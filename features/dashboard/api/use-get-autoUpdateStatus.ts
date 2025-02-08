import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ResponseType = {
    autoUpdateStatus: boolean;
} | null;

export function useGetAutoUpdateStatus(dashboardId: string) {
    const query = useQuery<ResponseType, Error>({
        enabled: !!dashboardId,
        queryKey: ["autoUpdateStatus", dashboardId],
        queryFn: async (): Promise<ResponseType> => {
            try {
                const response = await axios.get(`/api/dashboard/getAutoUpdateStatus?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching autoUpdateStatus:", error);
                throw new Error("Failed to fetch autoUpdateStatus");
            }
        }
    })

    return query;
}
