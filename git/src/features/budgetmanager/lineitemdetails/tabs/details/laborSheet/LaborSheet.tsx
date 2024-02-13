import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import IQButton from "components/iqbutton/IQButton";
import { useRef, useMemo, useState } from "react";
import SUIGrid from 'sui-components/Grid/Grid';

var data = [
    {
    id: 1,
    category: 'Apprentice',
    labors: [{
        id: 1,
        trade: 'Plumbing',
        defaultRate: 30,
    },
    {
        id: 2,
        trade: 'Mechanical',
        defaultRate: 50,
    }],
    },
    {
        id: 2,
        category: 'Architect',
        labors: [{
            id: 1,
            trade: 'Designer',
            defaultRate: 300,
        }],
        },
];
  

export const LaborSheetModel = (props:any) => {
	const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);    
    const [rowData, setRowData] = useState(data);
    console.log("LaborSheetModel")

    const columnDefs = [
        {
            headerName: 'Work Category',
			pinned: 'left',
			field: 'category',
			sort: 'asc',
			cellRenderer: 'agGroupCellRenderer'
        }
    ]

    const detailCellRendererParams = useMemo(() => {
		const details = {
			detailGridOptions: {
				headerHeight: 36,
				groupDefaultExpanded: 0,
				columnDefs: [
					{headerName: 'Trade', field: 'trade', minWidth: 220},
					{headerName: 'Default Rate', field: 'defaultRate'}
				]
			},
			getDetailRowData: (params: any) => {
				return params.successCallback(params?.data?.labors);
			}
		};
		return details;
	}, []);
    const gridRef = useRef();

    
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
		};
    }, []);
    
    const isRowMaster = (dataItem: any) => {
		return dataItem?.labor?.length !== 0 ? true : false;
	};
    const onSelect = () => {}
    
    return <IQBaseWindow
    open={true}
    title='Select From Labor Sheet'
    className="bm-importer"
    minHeight='300px'
    tools={{
        closable: true
    }}
    actions={
        <div>
            <IQButton color="orange" disabled={false} onClick={() => onSelect()}>
                PICK
            </IQButton>
        </div>
    }
    withInModule={true}
    {...props}
>
    <div style={gridStyle} className='ag-theme-alpine'>
        <SUIGrid
            ref={gridRef}
            rowData={rowData}
			detailCellRendererParams={detailCellRendererParams}   
            headers={columnDefs}
			isRowMaster={isRowMaster}
            defaultColDef={defaultColDef}
            groupDefaultExpanded={-1}
          />
    </div>
        {/* {showAlert?.show && <ConfirmationDialog handleAction={(type:string) => {handleAlertAction(type, importOption)}} content={showAlert?.msg}/>} */}
</IQBaseWindow>}