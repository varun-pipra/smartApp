import { isLocalhost, localServer } from "app/utils";
import { getServerInfo } from "app/hooks";

const moduleName = "Sbs Manager";
export const fetchPhaseDropdownData = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/phase?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    const modifiedRespone = responseData?.data?.map(
      (row: any, index: number) => {
        return { ...row, label: row.name, value: row.uniqueId };
      }
    );
    return modifiedRespone || [];
  }
  return [
    {
      id: 1,
      label: "Pre Construction",
      value: "e2ae03bd-f828-4da2-9d71-edfe9abd520b1",
      color: "#81c3dc",
    },
    {
      id: 2,
      label: "In Construction",
      value: "e2ae03bd-f828-4da2-9d71-edfe9abd520b2",
      color: "#d6a827",
    },
    {
      id: 3,
      label: "Post Construction",
      value: "e2ae03bd-f828-4da2-9d71-edfe9abd520b3",
      color: "#b88fc6",
    },
    {
      id: 4,
      label: "Operations and Manintenance",
      value: "e2ae03bd-f828-4da2-9d71-edfe9abd520b4",
      color: "#FFDDC01",
    },
  ];
};


