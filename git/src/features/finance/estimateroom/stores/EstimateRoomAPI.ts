import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import { EstimateRoomData } from "data/estimateRoom/EstimateRoomData";
const moduleName = "Estimate Room:";

// Grid Apis

export const fetchEstimateRoomGridList = async (payload:any) => {
    const server: any = getServerInfo();
    if (!isLocalhost) {
    } else {
      return EstimateRoomData;
    }
};
