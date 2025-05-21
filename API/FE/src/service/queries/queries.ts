import {
    useQuery,
  } from "@tanstack/react-query";
import { getCampaignByName } from "../api/api";

export function useFetchCampaignByName(_id: string) {
    return useQuery({
      queryKey: ["campaign", {_id }],
      queryFn: () => getCampaignByName(_id),
    })};