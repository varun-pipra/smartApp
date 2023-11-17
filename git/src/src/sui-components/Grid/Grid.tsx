import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import _ from 'lodash';
import 'ag-grid-enterprise';
import './Grid.scss';
import { ComponentClass, FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { GridOptions } from 'ag-grid-enterprise';

import { Helpers } from './Helpers';
import Toolbar from './Toolbar';
import React, { memo } from 'react';

import { fetchLineItemData } from '../../features/budgetmanager/operations/gridSlice';
import { setTransactionData } from '../../features/budgetmanager/operations/transactionsSlice';
import { getServer } from 'app/common/appInfoSlice';
import RTDataManager from 'utilities/realtime/RTDataManager';
import { setSelectedRows, fetchGridData, setGridData, setOriginalGridApiData, updateGridData, updateOriginalGridApiData, deleteGridData, deleteOriginalGridApiData } from '../../features/budgetmanager/operations/gridSlice';
import { setSelectedRowData } from 'features/budgetmanager/operations/rightPanelSlice';
import { showRightPannel } from 'features/budgetmanager/operations/tableColumnsSlice';
import { updateBudgetLineItem } from 'features/budgetmanager/operations/gridAPI';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import { any } from 'prop-types';
import noitemsavailable from '../../resources/images/common/noitemsavailable.svg';

import { FakeServer } from '../../examples/Grid/FakeServer.js';
import StatusBar from './StatusBar';
import { fetchForecastData, setForecastData, setCallForecastApi } from 'features/budgetmanager/operations/forecastSlice';
import { postMessage } from 'app/utils';

type ToolbarType = ComponentClass | FunctionComponent | 'sfg' | 'sfgWithViewBuilder' | null | undefined;

export interface TableGridProps extends AgGridReactProps {
	ref?: any;
	headers?: any;
	data?: any;
	grouped?: boolean;
	rowSelected?: any;
	onSelectionChanged?: any;
	setAGGridRef?: any;
	realTimeDocPrefix?: string;
	toolbar?: any;
	onRowDoubleClicked?: any;
	autoGroupColumnDef?: any;
	pinnedBottomRowConfig?: any;
	onRowClicked?: any;
	getRowId?: any;
	updatedObj?: any;
	tableref?: any;
	nowRowsMsg?: any;
	rowMessageHeading?: any;
	rowMessageIcon?: any;
	onCellMouseOver?: any;
	onCellMouseOut?: any;
	onBodyScrollEnd?: any;
	getRef?: any;
	pinnedTopRowData?: any;
	rowHeight?: any;
	getRowClass?: any;
	getReference?: any;
	//Grid-Copy Interfaces
	groupSelectsChildren?: boolean;
	rowClassRules?: any;
	cacheBlockSize?: any;
	infiniteInitialRowCount?: any;
	groupIncludeFooter?: boolean;
	serverSideInitialRowCount?: any;
	serverSideInfiniteScroll?: boolean;
	serverSideStoreType?: any;
	moduleName?: any;
	serverSideSortOnServer?: boolean;
	isServerSideGroupOpenByDefault?: any;
	tooltipShowDelay?: any;
	tooltipHideDelay?: any;
	emptyMsg?: any;
	suppressDragLeaveHidesColumns?: boolean;
	gridRef?: any;
	suppressMultiSort?: boolean;
	openLID?: boolean;
	isMainGrid?: boolean;
	selectedRecord?: any;
}

const SUIGrid = (props: TableGridProps) => {
	// console.log("props", props)
	const { headers, data, grouped = false, headerHeight = 36, animateRows = false, groupHeaderHeight = 36, rowSelection = 'multiple', suppressRowClickSelection = false, groupIncludeFooter = true,
		rowSelected = () => { }, onSelectionChanged = () => { }, autoGroupColumnDef = () => { }, onRowDoubleClicked = () => { }, onBodyScrollEnd = () => { }, nowRowsMsg, rowMessageHeading = '', rowMessageIcon = '', onRowClicked = () => { }, pinnedBottomRowData, rowModelType, groupIncludeTotalFooter = true, groupDisplayType,
		groupRowRendererParams, suppressContextMenu = false, onCellEditRequest, masterDetail = false, detailCellRendererParams = () => { }, onFirstDataRendered = () => { },
		isRowSelectable = useMemo(() => { return () => { return true; }; }, []), isRowMaster = () => { return false; }, groupDefaultExpanded = -1, rowHeight = null,
		groupSelectsChildren = true, cacheBlockSize, infiniteInitialRowCount, serverSideInitialRowCount = 50, serverSideInfiniteScroll = true, isServerSideGroupOpenByDefault = () => { }, serverSideStoreType = "partial",
		tooltipShowDelay = 0, tooltipHideDelay, emptyMsg = "No items are available", suppressDragLeaveHidesColumns = false, gridRef, suppressMultiSort = true, openLID = false, isMainGrid = false, selectedRecord = {},
		...rest } = props;

	const { gridData, selectedRows, originalGridApiData } = useAppSelector((state) => state.gridData);
	const { selectedRow } = useAppSelector(state => state.rightPanel);
	const rightPannel = useAppSelector(showRightPannel);
	const tableRef = useRef<any>();
	const dispatch = useAppDispatch();
	const { currencySymbol } = useAppSelector((state: any) => state.appInfo);
	const [updateData, setUpdateData] = React.useState<any>(null);
	//const [callForecastApi, setCallForecastApi] = React.useState<any>(false);
	const appInfo = useAppSelector(getServer);
	const realtimeRef = React.useRef(false);
	const [collapsedGroupHeaders, setCollapsedGroupHeaders] = useState<any>([]);
	const [totalCount, setTotalCount] = useState(10000);
	const [liveData, setLiveData] = useState<any>(null);
	const gridTooltipRef = useRef<any>();
	const isAppMaximized = useAppSelector((state) => state.appInfo.isAppMaximized);
	const tooltipTimerRef = useRef<any>();


	React.useEffect(() => {
		if (rightPannel && selectedRow?.id === updateData?.id) {
			// console.log('Forecast Data in Grid', updateData)
			dispatch(setSelectedRowData(updateData));
		}
	}, [updateData]);

	const onRowSelected = (e: any) => {
		if (isMainGrid && !openLID) {
			const selRows = tableRef?.current?.api?.getSelectedRows() || [];
			postMessage({
				event: "ctx-change",
				body: { iframeId: "", data: selRows },
			});
		}
		rowSelected(e);
	};

	useEffect(() => {
		if (openLID && selectedRecord && Object.keys(selectedRecord)?.length) {
			postMessage({
				event: "ctx-change",
				body: { iframeId: "", data: [selectedRecord] },
			});
			console.log('rows', selectedRecord);
		}
	}, [openLID, selectedRecord]);


	React.useEffect(() => {
		if (props.updatedObj) {
			// console.log('Updated object in the SUi Grid', originalGridApiData, props.updatedObj);
			const updatedKey = props.updatedObj?.field;
			const obj = originalGridApiData.find((row: any) => row.id === props.updatedObj.id);
			if (obj) {
				// console.log('Matched Object in the SUI Grid with Original Data', obj);
				const payloadObj = updatedKey === 'costCode' ? { ...obj, [updatedKey]: props.updatedObj.newValue, division: props?.updatedObj?.division } : { ...obj, [updatedKey]: props.updatedObj.newValue };
				const payload = {
					division: payloadObj.division,
					costCode: payloadObj.costCode,
					costType: payloadObj.costType,
					estimatedStart: new Date(payloadObj?.estimatedStart)?.toISOString(),
					estimatedEnd: new Date(payloadObj?.estimatedEnd)?.toISOString(),
					curve: payloadObj.curve,
					originalAmount: parseInt(payloadObj.originalAmount),
					status: payloadObj.status,
					Vendors: payloadObj.Vendors,
					description: payloadObj.description,
					unitCost: payloadObj?.unitCost,
					unitOfMeasure: payloadObj?.unitOfMeasure,
					unitQuantity: payloadObj?.unitQuantity,
					addMarkupFee: payloadObj?.addMarkupFee,
					markupFeeType: payloadObj?.markupFeeType,
					markupFeeAmount: payloadObj?.markupFeeAmount,
					markupFeePercentage: payloadObj?.markupFeePercentage
				};
				console.log('Payloaddd', payload);
				updateBudgetLineItem(appInfo, payloadObj.id, payload, (response: any) => {
					// dispatch(fetchGridData(appInfo));
				});
			};
		};
	}, [props.updatedObj]);

	const getChildCount = useCallback((data: any) => {
		return 26; //data ? data.childCount : undefined;
	}, []);

	const onPaginationChanged = (e: any) => {
		// console.log('onPaginationChanged: ', e, e.api.rowModel.getRowCount());

		let statusBarCmp = e.api.getStatusPanel('sui-status-bar');
		// console.log('onPaginationChanged: ', totalCount);
		if (statusBarCmp) {
			statusBarCmp.setRowDetail({
				totalRows: totalCount,
				loadedRows: e.api.rowModel.getRowCount()
			});
		}
	};

	const statusBar = useMemo(() => {
		return {
			statusPanels: [
				{
					statusPanel: StatusBar,
					align: 'right',
					key: 'sui-status-bar'
				}
			]
		};
	}, []);

	let defaultProps: GridOptions = {
		headerHeight: headerHeight,
		suppressRowClickSelection: suppressRowClickSelection,
		singleClickEdit: true,
		animateRows: animateRows,
		stopEditingWhenCellsLoseFocus: true,
		readOnlyEdit: true,
		rowSelection: rowSelection,
		suppressMultiSort: suppressMultiSort,
		getRowStyle: (params) => {
			if (params.node.rowPinned) {
				return {
					'font-weight': 'bold',
					'background-color': '#f1f1f1'
				};
			}
		},
		suppressContextMenu: suppressContextMenu,
		onCellEditRequest: onCellEditRequest
	};

	if (rowModelType == 'serverSide') {
		defaultProps.rowModelType = 'serverSide';
		defaultProps.serverSideInfiniteScroll = true;
		defaultProps.cacheBlockSize = 25;
		defaultProps.getChildCount = getChildCount;
		defaultProps.paginationAutoPageSize = true;
		defaultProps.onPaginationChanged = onPaginationChanged;
		defaultProps.statusBar = statusBar;

		// defaultProps.pagination = true;
		defaultProps.paginationPageSize = 25;
	} else {
		defaultProps.rowData = data;
	}

	const defaultGroupProps: GridOptions = {
		groupHeaderHeight: groupHeaderHeight,
		suppressAggFuncInHeader: true,
		groupDefaultExpanded: groupDefaultExpanded,
		groupIncludeFooter: groupIncludeFooter,
		groupIncludeTotalFooter: groupIncludeTotalFooter,
		groupDisplayType: groupDisplayType || 'multipleColumns',
		groupRowRendererParams: groupRowRendererParams
	};

	const defaultColumnDef: any = {
		flex: 1,
		minWidth: 192,
		sortable: true,
		resizable: true
	};


	const defaultColDef = useMemo(() => (defaultColumnDef), []);
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

	if (grouped === true) {
		Object.assign(defaultProps, defaultGroupProps);
	}

	//prepare the headers
	var effHeaders = Helpers.prepareHeaders(headers, {
		currencySymbol: currencySymbol || '$',
		enableCellFlash: animateRows
	});
	const onRowDragEnter = (e: any) => {
		// console.log('onRowDragEnter', e);
	};

	const onRowDragEnd = (params: any) => {
		var itemsToUpdate: any[] = [];
		let gridApi: any = params.api;

		gridApi.forEachNodeAfterFilterAndSort(function (rowNode: any) {
			itemsToUpdate.push(rowNode.data);
		});
		// setTableHeadersData(itemsToUpdate)
		defaultProps.rowData = itemsToUpdate;
	};

	useEffect(() => {
		tableRef?.current?.api?.setColumnDefs(effHeaders);
		// tableRef?.current?.api?.setAutoGroupColumnDef(autoGroupColumnDef);
	}, [headers]);

	const gridOptions = Object.assign(defaultProps, {
		columnDefs: effHeaders,
		defaultColDef: defaultColDef,
		tooltipShowDelay: 0,
		// onRowDragEnter:onRowDragEnter,
		rememberGroupStateWhenNewData: true,
		overlayNoRowsTemplate:
			`<span style='padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;'>No data</span>`
	});

	const onRowGroupOpened = (params: any) => {
		// console.log('onRowGroupOpened: ', params);
		if (params.expanded === false) {
			setCollapsedGroupHeaders([...collapsedGroupHeaders, params.node.key]);
		}
		else {
			setCollapsedGroupHeaders((products: any) => products.filter((value: any, index: any) => value !== params.node.key));
		}
	};

	const isGroupOpenByDefault = useCallback((params: any) => {
		const groupedData: any = props.data.map((data: any) => { return data.division; });
		const divisionData: any = groupedData.filter((item: any, index: any) => groupedData.indexOf(item) === index); //removing duplicate division

		const localData: any = sessionStorage.getItem('collapsedGroupHeaders'); // getting collapsed grouped array data 

		const lScollapsedGroupHeaders = JSON.parse(localData);

		const finalHeaderOpenedData = divisionData.filter((x: any) => !lScollapsedGroupHeaders.includes(x)); //Removing the collapsed data from the main division array

		if (finalHeaderOpenedData.length > 0) return finalHeaderOpenedData.includes(params.key);

	}, [props.data]);

	useEffect(() => {
		if (rowModelType !== 'serverSide') {
			defaultProps.rowData = props.data;
			tableRef?.current?.api?.setRowData(props.data);
		}
	}, [props.data]);

	const updateGridData = (newData: any) => {
		if (rowModelType !== 'serverSide') {
			defaultProps.rowData = newData;
			tableRef?.current?.api?.setRowData(newData);
		}
	};

	const addRealtimeListener = (projectUid: any, rtdManager: any) => {
		if (rtdManager && rtdManager.realTimeDocument && rtdManager.realTimeDocument._rtDocument) {
			let pathObject = rtdManager.realTimeDocument._rtDocument.at && rtdManager.realTimeDocument._rtDocument.at(`${props.realTimeDocPrefix}${projectUid}`);
			// console.log('pathObject', pathObject);
			pathObject && pathObject.on('change', '**', function (path: any, event: any) {
				let txnObject, liveData = event.value;
				// console.log('live data in real time', liveData, txnObject)
				if (_.has(liveData, 'update')) {
					const liveItem = liveData?.update;
					if (_.has(liveData, 'transactions')) {
						// console.log('transactions in grid', liveData, selectedRow)
						dispatch(setTransactionData(liveData?.transactions));
						//setCallForecastApi(true);
						dispatch(setCallForecastApi(true));
					}
					// if (_.has(liveData, 'forecast')) {
					// 	console.log('forecast in grid', liveData, selectedRow)
					// 	dispatch(setForecastData(liveData?.forecast));
					// 	// setCallForecastApi(true);
					// }
					setUpdateData(liveItem);
					if (!liveItem.length) txnObject = { update: [liveItem] };
				} else if (_.has(liveData, 'add')) {
					const liveItem = liveData?.add;
					// console.log('elseif liveaddliveItem', liveItem);
					if (!liveItem.length) txnObject = { add: [liveItem] };
				} else if (_.has(liveData, 'delete')) {
					const liveItem = liveData?.delete;
					txnObject = { remove: liveItem };
				}
				if (txnObject) {
					// console.log('txnObject', txnObject)
					// dispatch(setLiveData(txnObject));
					setLiveData(txnObject);
				}
				// console.log('Realtime change noticed.', event.value);
			});
			return;
		}

		setTimeout(() => {
			addRealtimeListener(projectUid, rtdManager);
		}, 1000);
	};

	const realtimeManager = () => {
		let config = {
			projectUid: appInfo.uniqueId,
			documentId: `${appInfo.urlAppZoneID}_${appInfo.uniqueId}`,
			baseUrl: appInfo.hostUrl,
			appzoneRTCServerUrl: appInfo.appzoneRTCServerUrl
		};

		// console.log('realtimemanager config: ', config);
		if (config.documentId) {
			try {
				let rtdManager = new RTDataManager(config);
				document.addEventListener('setlivetransactions', function (event: any) {
					if (event.detail && rtdManager && rtdManager.updateRealTimeModel) {
						rtdManager.updateRealTimeModel(`${props.realTimeDocPrefix}${config.projectUid}`, `budgetManagerLineItems@${config.projectUid}`, event.detail, 2);
					}
				});

				setTimeout(function () {
					addRealtimeListener(config.projectUid, rtdManager);
				}, 1000);
			} catch (e) {
				// console.log('Failed to create rtDocument', e);
			}
		}
	};

	React.useEffect(() => {
		if (props.realTimeDocPrefix && props.realTimeDocPrefix.length > 0) {
			if (realtimeRef.current) return;
			realtimeRef.current = true;
			setTimeout(function () {
				realtimeManager();
			}, 3000);
		} else {
			console.warn('Missing realTimeDocPrefix property. Real time update feature is disabled!');
		}
	}, []);

	const getToolbar = (type: any) => {
		if (type) {
			// console.log('Toolbar: ', type, typeof type);
			if (typeof type === 'string') {
				if (type === 'sfg') {
					return (
						<Toolbar></Toolbar>
					);
				}

				if (type === 'sfgWithViewBuilder') {
					return (
						<Toolbar></Toolbar>
					);
				}
			} else {
				return (
					type
				);
			}
		}
	};

	// React.useEffect(() => {
	// 	if(liveData) {
	// 		// console.log('tableRef?.current -->', tableRef?.current)
	// 		if('add' in liveData) {
	// 			// dispatch(setGridData([...gridData, ...liveData.add]))
	// 			console.log("add live", liveData);
	// 			tableRef?.current?.api?.applyTransaction(liveData);
	// 			dispatch(setGridData([...originalGridApiData, ...liveData.add]));
	// 			setTimeout(() => {
	// 				tableRef.current!?.api?.forEachNode((rowNode: any, index: any) => {
	// 					if(rowNode.data) {
	// 						console.log("live rowNode", rowNode.data)
	// 						if(rowNode.data?.id == liveData.add[0]?.id) {
	// 							const newlyAddedRec = tableRef.current!?.api?.getDisplayedRowAtIndex(rowNode.rowIndex)!;
	// 							tableRef.current!?.api?.flashCells({rowNodes: [newlyAddedRec]});
	// 						}
	// 					}
	// 				});
	// 			}, 500);
	// 		}
	// 		if('update' in liveData) {

	// 			console.log('updated Item', liveData.update[0]);

	// 			let diffKey: any = [];
	// 			let updatedRec: any;
	// 			tableRef.current!?.api?.forEachNode((row: any) => {
	// 				if(row?.data) {
	// 					if(row?.data?.id == liveData.update[0]?.id) {
	// 						diffKey = objDiff(row?.data, liveData.update[0]);
	// 						// console.log('diffKey key-->', diffKey);
	// 						updatedRec = tableRef.current!?.api?.getDisplayedRowAtIndex(row.rowIndex)!;
	// 					}
	// 				}
	// 			});

	// 			setTimeout(() => {
	// 				tableRef?.current?.api?.applyTransaction(liveData);
	// 				dispatch(updateOriginalGridApiData(liveData.update[0]));

	// 				if(diffKey.length) {
	// 					console.log('diffKey inside -->', diffKey);
	// 					tableRef.current!?.api?.flashCells({rowNodes: [updatedRec], columns: ['division', ...diffKey]});
	// 				}
	// 			}, 2000);

	// 		}
	// 		if('remove' in liveData) {
	// 			// console.log('Delete Item', liveData.remove);
	// 			// dispatch(deleteGridData(liveData.remove));
	// 			tableRef?.current?.api?.applyTransaction(liveData);
	// 			dispatch(deleteOriginalGridApiData(liveData.remove));
	// 		}
	// 	}
	// }, [liveData]);

	const getServerSideDatasource = (server: any) => {
		return {
			getRows: (params: any) => {
				// console.log('[Datasource] - rows requested by grid: ', params.request);
				var response = server.getData(params.request);
				// adding delay to simulate real server call
				setTimeout(function () {
					if (response.success) {
						// call the success callback
						// console.log('[Datasource] - rows returned: ', response);
						params.success({
							rowData: response.rows,
							rowCount: response.lastRow,
						});
					} else {
						// inform the grid request failed
						params.fail();
					}
				}, 1000);
			},
		};
	};

	const onGridReady = (params: any) => {
		let gridApi: any = params.api;
		let gridColumnApi: any = params.columnApi;
		// console.log(gridColumnApi.getAllGridColumns());

		// gridApi.showNoRowsOverlay();

		if (props.pinnedBottomRowConfig) {
			setTimeout(() => {
				let pinnedBottomData = Helpers.generatePinnedBottomData(gridApi, gridColumnApi, props.pinnedBottomRowConfig);
				gridApi.setPinnedBottomRowData([pinnedBottomData]);
			}, 500);
		}
		if (props.tableref) {
			props.tableref(gridApi);
		}
		if (props.getRef) {
			props.getRef(gridApi);
		}
		if (props.getReference) {
			props.getReference(tableRef);
		}
		if (rowModelType == 'serverSide') {
			// console.log('Fetching data...');
			// fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
			// fetch('https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/EnterpriseDesktop/api/v2/budgets/190e55b8-5907-42cd-9d94-13024a8ea568/lineitems?sessionId=c0dc8a06b1ba43bca45e0920d8be3d07')
			fetch('http://localhost:3000/data10000.json')
				// fetch('http://localhost:3000/data.json')
				// fetch('http://localhost:3108/api/Budgets')
				.then((resp) => resp.json())
				.then((data) => {
					// setup the fake server with entire dataset
					var fakeServer = FakeServer(data.data);
					setTotalCount(data.count);
					// create datasource with a reference to the fake server
					var datasource = getServerSideDatasource(fakeServer);
					// register the datasource with the grid
					params.api.setServerSideDatasource(datasource);
				});
		}

	};

	const componentStateChanged = (params: any) => {
		let gridApi: any = params.api;
		if (props.data?.length) {
			let gridColumnApi: any = params.columnApi;

			if (props.pinnedBottomRowConfig) {
				setTimeout(() => {
					let pinnedBottomData = Helpers.generatePinnedBottomData(gridApi, gridColumnApi, props.pinnedBottomRowConfig);
					gridApi.setPinnedBottomRowData([pinnedBottomData]);
				}, 500);
			}
		} else {
			gridApi.setPinnedBottomRowData([]);
		}
	};

	const objDiff = (oldRec: any, newRec: any) => {
		// console.log('Object.keys(oldRec, newRec)-->', Object.values(oldRec), Object.values(newRec));
		let keyValues;
		keyValues = Object.keys(oldRec).filter(key => {
			if (typeof (oldRec[key]) != 'object') {
				// if(((oldRec[key] != undefined && oldRec[key] != null) &&  (newRec[key] != undefined && newRec[key] != null))){
				if (oldRec[key] != newRec[key]) {
					if (!['modifiedDate', 'rowId'].includes(key)) {
						console.log('Object key-->', key);
						return key;
					}
				}
				// }				
			}
		});

		// console.log('keyValues--->', keyValues);
		return keyValues.filter((element) => {
			return element != undefined || element != null;
		});
	};

	const onCellMouseOver = (params: any) => {
		const isTooltipNotNeeded = (params.columnApi?.columnModel?.columnDefs || []).find((rec: any) => rec.ignoreDefaultTooltip === true)?.ignoreDefaultTooltip;
		if (isTooltipNotNeeded) return;
		const el = params.event.target;
		const boundingClient = el.getBoundingClientRect();
		const topPosition =
			(boundingClient.bottom - (isAppMaximized ? 0 : 40)) + "px";
		const leftPosition =
			boundingClient.width + boundingClient.left - 110 + (isAppMaximized ? 0 : -40) + "px";
		let tooltipText =
			typeof params.value === "string" ? params.value : el.innerText;
		let display = el.clientWidth < el.scrollWidth;
		if (el.lastElementChild) {
			display =
				el.lastElementChild.offsetWidth < el.lastElementChild.scrollWidth;
		}
		if (el.querySelector('.ag-group-value')) {
			display = el.querySelector('.ag-group-value').clientWidth < el.querySelector('.ag-group-value').scrollWidth;
		}
		if (display) {
			tooltipTimerRef.current = setTimeout(() => {
				toggleGridCellTooltip(display, topPosition, leftPosition, tooltipText);
			}, 500);
		}
	};

	const onCellMouseOut = () => {
		if (gridTooltipRef?.current) {
			gridTooltipRef.current.style.display = "none";
		}
		if (tooltipTimerRef.current) {
			clearTimeout(tooltipTimerRef.current);
		}
	};

	const toggleGridCellTooltip = (
		display: any,
		topPosition: any,
		leftPosition: any,
		tooltipText: any
	) => {
		if (gridTooltipRef?.current) {
			if (display && gridTooltipRef.current.style.display === 'block') {
				return;
			}
			gridTooltipRef.current.style.top = topPosition;
			gridTooltipRef.current.style.left = leftPosition;
			gridTooltipRef.current.innerHTML = tooltipText;
			gridTooltipRef.current.style.display = display ? "block" : "none";
		}
	};

	return (
		<div style={gridStyle} className='ag-theme-alpine sui-grid'>
			{getToolbar(props.toolbar)}
			{/* {rowModelType == 'serverSide' || (props.data && props.data?.length > 0) ? */}
			<AgGridReact
				gridOptions={gridOptions}
				ref={tableRef}
				// rowData={data}
				getDataPath={rest.getDataPath}
				treeData={rest.treeData}
				masterDetail={masterDetail}
				animateRows={animateRows}
				autoGroupColumnDef={autoGroupColumnDef}
				isGroupOpenByDefault={props.isGroupOpenByDefault}
				onRowSelected={(e) => onRowSelected(e)}
				onSelectionChanged={(e) => { onSelectionChanged(e); }}
				// onRowClicked={(e) => onRowClicked(e, tableRef)}
				onRowDoubleClicked={(e) => onRowDoubleClicked(e, tableRef)}
				onBodyScrollEnd={(e: any) => onBodyScrollEnd(e)}
				onRowGroupOpened={props.onRowGroupOpened}
				onCellEditingStopped={props.onCellEditingStopped}
				// onGridReady={() => { setAGGridRef(tableRef); console.log('table ref', tableRef) }}
				// {...rest}
				onGridReady={onGridReady}
				onComponentStateChanged={componentStateChanged}
				getRowId={props.getRowId && props.getRowId}
				rowDragManaged={true}
				onRowDragEnd={props.onRowDragEnd}
				overlayNoRowsTemplate={props.pinnedTopRowData?.length > 0 ? '<span></span>' :
					`<div class='no-rows-msg'>
						<span class='${rowMessageIcon ? rowMessageIcon : 'common-icon-No-Item-Available'}'></span>
						<div class='empty-rows-mark'>${rowMessageHeading ? rowMessageHeading : emptyMsg}</div>
							${nowRowsMsg ? nowRowsMsg : ''}
					</div>`
				}
				onCellMouseOver={onCellMouseOver}
				onCellMouseOut={onCellMouseOut}
				detailCellRendererParams={detailCellRendererParams}
				onFirstDataRendered={onFirstDataRendered}
				isRowMaster={isRowMaster}
				pinnedTopRowData={props.pinnedTopRowData}
				rowHeight={rowHeight}
				getRowClass={props?.getRowClass}
				groupSelectsChildren={groupSelectsChildren}
				isRowSelectable={isRowSelectable}
				groupDefaultExpanded={groupDefaultExpanded}
				//Grid-Copy Properties
				// rowModelType={rowModelType}
				// cacheBlockSize={cacheBlockSize}
				// infiniteInitialRowCount={infiniteInitialRowCount}
				// serverSideInitialRowCount={serverSideInitialRowCount}
				// serverSideInfiniteScroll={serverSideInfiniteScroll}
				// serverSideStoreType={serverSideStoreType}
				// blockLoadDebounceMillis = {1000}
				// debug = {true}
				// isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
				// tooltipShowDelay={tooltipShowDelay}
				// tooltipHideDelay={tooltipHideDelay}
				suppressDragLeaveHidesColumns={suppressDragLeaveHidesColumns}
				initialGroupOrderComparator={props?.initialGroupOrderComparator}
				rowClassRules={props?.rowClassRules}
			></AgGridReact>
			<div ref={gridTooltipRef} className="sui-grid-cell-ellipisis-tooltip" style={{ display: 'none' }}></div>
			{/* :
				'There are no rows in the view'
			} */}
		</div>
	);
};

export default memo(SUIGrid);