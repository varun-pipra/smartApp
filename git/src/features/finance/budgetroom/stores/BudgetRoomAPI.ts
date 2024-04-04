import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import { BudgetRoomData } from "data/budgetRoom/BudgetRoomData";
const moduleName = "Budget Room:";

// Grid Apis

export const fetchBudgetRoomGridList = async (payload:any) => {
    const server: any = getServerInfo();
    if (!isLocalhost) {
    } else {
      return BudgetRoomData;
    }
};
