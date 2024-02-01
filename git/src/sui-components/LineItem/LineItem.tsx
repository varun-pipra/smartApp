import * as React from 'react';
import SUIGrid, { TableGridProps } from '../Grid/Grid';
import "./LineItem.scss";
import { useState, useEffect, useCallback } from 'react';
import { Helpers } from 'sui-components/Grid/Helpers';
import ClearIcon from '@mui/icons-material/Clear';
//import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import SUIAlert from "sui-components/Alert/Alert";

export interface SuiLineItemProps extends TableGridProps {
	onAdd?: Function,
	onRemove?: Function,
	enbleAddBtn?: any;
	newRecord?: any;
	nowRowsMsg?: any;
	canAddEmptyRecords?: any;
	columnsToRefresh?: any;
	actionheaderprop?: any;
	readOnly?: boolean;
	addRowPosition?: string;
	showAddRow?: boolean;
	pinnedTopRowData?: any;
	hasPinnedTopRow?: any;
	deleteConfirmationRequired?: boolean;
	onGridApiChange?: any;
	getRowClass?: any;
	rowSelected?: any;
	adddisable?: any;
	rowMessageHeading?: any;
	rowMessageIcon?: any;
	headers?: any;
	moduleName?:string;
}

const SUILineItem = (props: SuiLineItemProps) => {

	let {
		headers,
		data,
		pinnedBottomRowConfig,
		enbleAddBtn = true,
		newRecord,
		canAddEmptyRecords = true,
		nowRowsMsg,
		columnsToRefresh = [],
		actionheaderprop,
		addRowPosition = "top",
		rowHeight = null,
		rowSelected = () => { },
		rowMessageHeading = '',
		rowMessageIcon = '',
		moduleName=null
	} = props;
	const [updatedheaders, setUpdatedHeaders] = useState([]);

	const [rowData, setRowData] = useState(data);
	const [gridApi, setGridApi] = useState<any>();
	const [showAlert, setShowAlert] = useState<any>(false);
	const [confirmationRec, setConfirmationRec] = useState<any>({});

	const gridRef = React.useRef<any>();
	const recRef = React.useRef<any>();
	useEffect(() => {
		recRef.current = props.newRecord;
		if (gridApi && columnsToRefresh?.length > 0) {
			gridApi.refreshCells({ columns: columnsToRefresh, force: true });
		}
	}, [props.newRecord]);

	useEffect(() => {
		document.addEventListener('updateSOVRec', function (event: any) {
			// console.log('updateSOVRec event==>',event);
			recRef.current = event.detail.current;
		});
	}, [])

	// useEffect(() => {if(props?.onGridApiChange) props?.onGridApiChange(gridApi)}, [gridApi])


	useEffect(() => {
		setRowData(data);
		gridRef.current = data;
		if (gridApi ?? false) {
			props?.tableref && props?.tableref(gridApi);
		};
	}, [props?.data]);


	useEffect(() => {
		headers?.forEach((h: any) => {
			h.menuTabs = [];
			h.suppressMovable = true;
		});
		// console.log("issue with type action", enbleAddBtn);

		if (!headers?.find((h: any) => h.type == "action")) {
			if (!props.readOnly) {
				headers.push({
					type: "action",
					menuTabs: [],
					...actionheaderprop,
					cellRenderer: (params: any) => {
						const disbledAddBtn = props.hasPinnedTopRow || props.adddisable ? !params?.data?.enableAddBtn : !enbleAddBtn;
						if (params.node.isRowPinned() && params.node.rowPinned !== 'top') {
							return "";
						}
						if (params.node.rowPinned === 'top' && (props?.showAddRow != undefined ? props?.showAddRow : true)) {
							return (
								<IconButton aria-label="add" className="line-add-btn" disabled={disbledAddBtn}>
									<span onClick={(e) => { onAdd(e, rowData[0], params) }} className="common-icon-add"></span>
								</IconButton>
							);
						}
						if (params.node.rowIndex == 0 && !props.hasPinnedTopRow && (props?.showAddRow != undefined ? props?.showAddRow : true)) {
							return (
								<IconButton aria-label="add" className="line-add-btn" disabled={disbledAddBtn}>
									<span onClick={(e) => { onAdd(e, rowData[0], params) }} className="common-icon-add"></span>
								</IconButton>
							);
						} else {
							// console.log("params", params)
							return params?.data?.status !== 'Paid' ?  (
								<ClearIcon
									className="line-clear-btn"
									onClick={(e) => onRemove(e, params.node.rowIndex, params)}
								/>
							) : null;
						}
					},
					cellStyle: {
						display: 'flex',
						justifyContent: 'center'
					}
				});
			}
		}
		setUpdatedHeaders(headers);
	}, [headers, props?.showAddRow, props.readOnly, props.data, enbleAddBtn]);

	//enhance header info with additional configs


	const onRemove = (e: any, rowIdx: any, gridParams: any) => {
		if (!props.deleteConfirmationRequired) {
			confirmRemove(e, rowIdx, gridParams);
		} else {
			setConfirmationRec({ e: e, rowIdx: rowIdx, gridParams: gridParams });
			setShowAlert(true);
		}

	}

	const confirmRemove = (e: any, rowIdx: any, gridParams: any) => {
		if (props.onRemove) {
			console.log("on remove")
			const records = [...gridRef.current];
			records?.splice(rowIdx, 1);
			gridRef.current = records;
			// gridRef.current?.splice(rowIdx, 1);
			setRowData(gridRef.current);
			gridParams.api.setRowData(gridRef.current);

			let gridApi: any = gridParams.api;
			let gridColumnApi: any = gridParams.columnApi;

			if (props.pinnedBottomRowConfig) {
				setTimeout(() => {
					let pinnedBottomData = Helpers.generatePinnedBottomData(
						gridApi,
						gridColumnApi,
						pinnedBottomRowConfig
					);
					gridApi.setPinnedBottomRowData([pinnedBottomData]);
				}, 500);
			}

			props.onRemove(gridParams?.data?.id, gridRef.current);
		}
	};

	const onAdd = (e: any, data: any, gridParams: any) => {
		console.log("on Add")
		if (!canAddEmptyRecords && Object.keys(recRef.current)?.length === 0) return;
		if (props.onAdd) {
			// console.log("adddd", gridParams?.data, recRef.current);
			let gridApi: any = gridParams.api;
			let gridColumnApi: any = gridParams.columnApi;

			if (!props.hasPinnedTopRow) {
				if (addRowPosition == 'top') {
					gridRef.current.splice(1, 0, recRef.current);
				} else {
					const records = [...gridRef.current];
					records.push({ ...recRef.current });
					gridRef.current = records;
				}
				gridRef.current[0] = {};
			} else {
				if (addRowPosition == 'top') {
					gridRef.current.splice(1, 0, recRef.current);
				} else {
					const records = [...gridRef.current];
					records.push({ ...recRef.current });
					gridRef.current = records;
				}
				//gridRef.current[0] = {};
				gridApi.setPinnedTopRowData([{}]);
			}


			setRowData(gridRef.current);
			gridParams.api.setRowData(gridRef.current);



			if (props.pinnedBottomRowConfig) {
				setTimeout(() => {
					let pinnedBottomData = Helpers.generatePinnedBottomData(gridApi, gridColumnApi, pinnedBottomRowConfig);
					gridApi.setPinnedBottomRowData([pinnedBottomData]);
				}, 500)
			}
			props.onAdd(recRef.current, gridRef.current);
		}
	}

	const onCellEditRequest = useCallback(
		(event: any) => {
			const evData = event.data;
			const field = event.colDef.field;
			const newValue = event.newValue;
			const newItem = { ...evData };
			newItem[field] = newValue * 1;
			gridRef.current[event.node.rowIndex] = newItem;
			setRowData(gridRef.current);
			event.api.setRowData(gridRef.current);
		},
		[gridRef.current]
	);

	return (
		<>
			<SUIGrid
				suppressContextMenu={true}
				tableref={(val: any) => setGridApi(val)}
				className={"lineitem-cls"}
				headers={updatedheaders}
				data={rowData}
				pinnedBottomRowConfig={pinnedBottomRowConfig}
				onCellEditRequest={onCellEditRequest}
				nowRowsMsg={nowRowsMsg}
				moduleName={props?.moduleName}													
				pinnedTopRowData={props.pinnedTopRowData}
				rowHeight={rowHeight}
				getRowClass={props?.getRowClass}
				rowSelected={rowSelected}
				rowMessageIcon={rowMessageIcon}
				rowMessageHeading={rowMessageHeading}
			></SUIGrid>

			{showAlert && (
				<SUIAlert
					open={showAlert}
					onClose={() => {
						setShowAlert(false);
					}}
					contentText={
						<span>
							Deleting a row would alter the configuration setup and you may
							have to reconfigure.
							<br />
							<br /> Are you sure want to continue?
						</span>
					}
					title={"Confirmation"}
					onAction={(e: any, type: string) => {
						if (type === "yes") {
							console.log("yess")
							setShowAlert(false);
							confirmRemove(
								confirmationRec.e,
								confirmationRec.rowIdx,
								confirmationRec.gridParams
							);
						} else {
							setShowAlert(false);
						}
					}}
				/>
			)}
		</>
	);
};

export default SUILineItem;