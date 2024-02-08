import IQSearch from 'components/iqsearchfield/IQSearchField';
import { Box, Stack } from '@mui/material';
import { useMemo, useState} from 'react';
import SUIGrid from 'sui-components/Grid/Grid';
import './WorkerGrid.scss';
import IQButton from 'components/iqbutton/IQButton';
import ManageWorkers from './addManageWorkers/ManageWorkers'

import { workTeamData , workTeamGridData } from 'data/timelog/TimeLogData';

const WorkersGrid = () => {
    const [selectedRowData,setSelectedRowData] = useState<any>([])
    const [openManageWorkers,setOpenManageWorkers] = useState<any>(false)

    const rowSelected=(sltdRows:any)=>{
        const selectedRowData = sltdRows.api.getSelectedRows();
        setSelectedRowData(selectedRowData)
    } 

    const handelAddSelect=(boolean:boolean)=>{
        setOpenManageWorkers(boolean)
    }

    const headers = useMemo(() => [
		{
			headerName: 'FRIST NAME',
			field: 'fristName',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			suppressMenu: true,
		}, {
			headerName: 'LAST NAME',
			field: 'lastName',
			minWidth: 170,
			suppressMenu: true,
		}, {
			headerName: 'COMPANY',
			field: 'company',
			minWidth: 150,
			suppressMenu: true,
		},
		{
			headerName: 'EMAIL',
			field: 'email',
			suppressMenu: true,
		},
		{
			headerName: 'TRADE HOURES',
			field: 'tradeHours',
			minWidth: 150,
			suppressMenu: true,
		}, {
			headerName: 'PHONE',
			field: 'phoneNumber',
			suppressMenu: true,
		},
	], []);


    return (
        <div className='workers-main-container'>
            <div>
                <Box className="tab-bid-queries">
                    <Stack direction="row" className="search-box">
                        <IQSearch/>
                    </Stack>                    
                </Box>
            
                <div className='worker-grid-cont'>
                    <SUIGrid
                        headers={headers}
                        data={workTeamGridData}
                        rowSelected={(e: any) => rowSelected(e)}
                        getRowId={(record: any) => record.data.id}
                    />
                </div>
            </div>
            <div className="footer">
                <span style={{padding: '0px 15px' , fontStyle: 'italic',color: 'gray'}}>Selected User{selectedRowData.length > 1 ? 's' : ""} ({selectedRowData.length})</span>
                <IQButton
                    className="ce-buttons add-selected-worker-btn"  
                    color="blue"
                    disabled={selectedRowData.length === 0}
                    onClick={() => handelAddSelect(true)}
                >
                    ADD SELECTED
                </IQButton>
            </div>

            {openManageWorkers?(
                <ManageWorkers workerData={workTeamData} onClose={()=>handelAddSelect(false)}/>
            ):<></>}
            
        </div>
)
}

export default WorkersGrid;