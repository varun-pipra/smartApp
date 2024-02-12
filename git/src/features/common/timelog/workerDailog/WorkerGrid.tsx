import IQSearch from "components/iqsearchfield/IQSearchField";
import { Box, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import "./WorkerGrid.scss";
import IQButton from "components/iqbutton/IQButton";
import ManageWorkers from "./addManageWorkers/ManageWorkers";
import { getWorkTeamData, getWorkTeamGridData } from "../stores/TimeLogSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";

const WorkersGrid = () => {
  const dispatch = useAppDispatch();
  const [selectedRowData, setSelectedRowData] = useState<any>([]);
  const [openManageWorkers, setOpenManageWorkers] = useState<any>(false);
  const [workData, setWorkData] = useState<any>([]);
  const [teamData, setTeamData] = useState<any>([]);

  const { workTeamData, workTeamGridData } = useAppSelector(
    (state) => state.timeLogRequest
  );
  const rowSelected = (sltdRows: any) => {
    const selectedRowData = sltdRows.api.getSelectedRows();
    setSelectedRowData(selectedRowData);
  };

  useEffect(() => {
    dispatch(getWorkTeamData());
    dispatch(getWorkTeamGridData());
  }, []);

  useEffect(() => {
    setTeamData(workTeamData || []);
  }, [workTeamData]);

  useEffect(() => {
    setWorkData(workTeamGridData || []);
  }, [workTeamGridData]);

  const handelAddSelect = (isOpen: boolean) => {
    setOpenManageWorkers(isOpen);
  };

  const headers = useMemo(
    () => [
      {
        headerName: "FRIST NAME",
        field: "fristName",
        sort: "asc",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 300,
        suppressMenu: true,
      },
      {
        headerName: "LAST NAME",
        field: "lastName",
        minWidth: 170,
        suppressMenu: true,
      },
      {
        headerName: "COMPANY",
        field: "company",
        minWidth: 150,
        suppressMenu: true,
      },
      {
        headerName: "EMAIL",
        field: "email",
        suppressMenu: true,
      },
      {
        headerName: "TRADE HOURES",
        field: "tradeHours",
        minWidth: 150,
        suppressMenu: true,
      },
      {
        headerName: "PHONE",
        field: "phoneNumber",
        suppressMenu: true,
      },
    ],
    []
  );

  return (
    <div className="workers-main-container" style={{ height: 'calc(100% - 70px)' }}>
        <Box>
          <Stack direction="row" className="search-box">
            <IQSearch />
          </Stack>
        </Box>

        <div className="worker-grid-cont">
          <SUIGrid
            headers={headers}
            data={workData}
            rowSelected={(e: any) => rowSelected(e)}
            getRowId={(record: any) => record.data.id}
          />
        </div>
      <div className="footer">
        <span
          style={{ padding: "0px 15px", fontStyle: "italic", color: "gray" }}
        >
          Selected User{selectedRowData.length > 1 ? "s" : ""} (
          {selectedRowData.length})
        </span>
        <IQButton
          className="ce-buttons add-selected-worker-btn"
          color="blue"
          disabled={selectedRowData.length === 0}
          onClick={() => handelAddSelect(true)}
        >
          ADD SELECTED
        </IQButton>
      </div>

      {openManageWorkers ? (
        <ManageWorkers
          workerData={teamData}
          onClose={() => handelAddSelect(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkersGrid;
